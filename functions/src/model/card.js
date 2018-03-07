'use strict';

const db = require('../utils/admin').db;
const { strings } = require('../entrypoints/dialogflow/constants');
const admin = require('../utils/admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });

const log = console;
const COLLECTION = 'cards';

class Card {
  static get COLLECTION() {
    return COLLECTION;
  }

  constructor(_userId = null) {
    this.id = 0;
    this.userId = _userId;

    // Used for card generation
    this.tone = 'custom';
    this.designId = '';
    this.textId = 0;
    this.message = '';
    this.signature = '';
    // Generated url and state
    this.url = '';
    this.isPublic = false;
    this.isShared = false;
    //
    this.createdAt = null;
    this.docRef = null;
  }

  getId() {
    return this.id;
  }

  get data() {
    return {
      tone: this.tone,
      userId: this.userId,
      designId: this.designId,
      textId: this.textId,
      url: this.url,
      message: this.message,
      signature: this.signature,
      isPublic: this.isPublic,
      isShared: this.isShared,
      createdAt: this.createdAt
    };
  }

  set data(obj) {
    Object.keys(obj).forEach(prop => {
      this[prop] = obj[prop];
    });
  }

  getDocRef(id) {
    if (!this.docRef) {
      let dref = db.collection(COLLECTION).doc(id);
      this.docRef = dref;
    }
    return this.docRef;
  }

  createFromUser(userObj) {
    return this.create(userObj);
  }
  createFromCardData(cardObj) {
    this.data = cardObj;
  }

  create(userObj) {
    this.data = {
      createdAt: Date.now(),
      userId: userObj.getId(),
      tone: userObj.cardTone,
      designId: userObj.cardDesign,
      textId: userObj.cardText,
      message: userObj.cardMessage,
      signature: userObj.signature
    };
    return this._create();
  }

  _create() {
    console.log(this.data);
    return new Promise((resolve, reject) => {
      db
        .collection(COLLECTION)
        .add(this.data)
        .then(docRef => {
          this.docRef = docRef;
          this.id = docRef.id;
          resolve(this);
        })
        .catch(error => {
          log.error('Error creating card in db: ', error);
          reject(error);
        });
    });
  }

  update() {
    return this.getDocRef(this.id)
      .update(this.data)
      .then(updateResult => {
        log.info('update: Update', { update_result: updateResult });
        return updateResult;
      })
      .catch(err => {
        log.info('update: Error', { exception: err });
        throw err;
      });
  }

  /*

  */
  loadById(id) {
    return this.getDocRef(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.data = doc.data();
          this.exists = true;
          this.id = id;
        } else {
          this.exists = false;
        }
      })
      .catch(err => {
        log.error('card:loadById:catch', err);
        throw err;
      });
  }

  save() {}

  /*

  Split text into multiple lines of no more than max_chars characters

  */
  splitText(text, max_chars = 38, max_lines = 2) {
    const words = text.split(' ');
    const ellipsis = '...';
    let newText = '';
    let lines = 1;
    let lineLength = 0;
    for (let i = 0; i < words.length; i++) {
      if (lineLength + String(words[i]).length > max_chars) {
        if (String(words[i]).length > 16) {
          words[i] =
            words[i].substr(0, Math.floor(String(words[i]).length / 2)) +
            '—' +
            '\n' +
            words[i].substr(Math.floor(String(words[i]).length / 2));
          //lines++;
        }
        lineLength = 0;
        lines++;

        if (lines > max_lines) {
          newText += ellipsis;
          break;
        }
        newText += '\n';
      }
      newText += ' ' + words[i];
      lineLength += words[i].length + 1;
    }
    return newText;
  }

  // Returns a template
  templateFactory() {
    if (this.imageTemplate.template === 'custom') {
      return this.gmTemplateCustom;
    } else {
      return this.gmTemplateBasic;
    }
  }

  //
  // G/I Magick settings for 'basic' card template
  // (text is bottom centred)
  //
  gmTemplateBasic(imagePath, fontFile, color = '#5579ff') {
    let text = this.splitText(this.message);
    let gmOut = this.createGm(imagePath, fontFile, -25)
      .fill('#000000')
      .gravity('South')
      .drawText(0, 125, text);

    if (this.signature !== null && this.signature !== '') {
      gmOut
        .fill(color)
        .gravity('South')
        .drawText(80, 15, '— ' + this.signature);
    }
    gmOut.in('-flatten');
    return gmOut;
  }

  //
  // G/I Magick settings for 'custom' card template
  // (text is centered)
  //
  gmTemplateCustom(imagePath, fontFile, color = '#000000') {
    let text = this.splitText(this.message, 26, 3);
    let gmOut = this.createGm(imagePath, fontFile, -45)
      .fill(color) //720, 1540
      .gravity('Center') // pos 105 with four lines
      .drawText(0, 0, text);

    gmOut.in('-flatten');
    return gmOut;
  }

  // Default Graphics/Image Magick settings
  createGm(imagePath, fontFile, lineSpacing) {
    return gm(imagePath)
      .font(fontFile)
      .in('-interline-spacing')
      .in(lineSpacing)
      .in('-background')
      .in('#FFFFFF')
      .fontSize(100);
    //  -alpha remove  ?
  }

  /*
    Renders current card image
  */
  render() {
    const { templates } = strings;
    this.imageTemplate = templates.images[this.designId];

    if (this.id === null) {
      return Promise.reject('No id');
    }
    return this.renderTemplate(
      this.imageTemplate.names[this.textId] + templates.input.ext,
      this.id + templates.output.ext
    );
  }

  /*

    Render an image from a template

  */
  renderTemplate(fileName = 'playful-router.png', output = '') {
    return new Promise((resolve, reject) => {
      const bucket = admin.storage.bucket();
      const osTmpPath = os.tmpdir();

      // Generatoer template to use
      let template = this.templateFactory().bind(this);

      // font details
      const fontFilename = 'JustMeAgainDownHere.ttf';
      const fontFile = bucket.file(`templates/${fontFilename}`);
      const fontTmpPath = path.join(osTmpPath, fontFilename);
      const fontDownloadPromise = fontFile.download({
        destination: fontTmpPath
      });

      // Image details
      const imageFilename = fileName;
      const imagePath = `templates/${imageFilename}`;
      const userId = this.userId.substr(16);
      const imageOutputPath = `out/${userId}/${output}`;

      const imageFile = bucket.file(imagePath);
      const imageTmpPath = path.join(osTmpPath, fileName);
      const imageDownloadPromise = imageFile.download({
        destination: imageTmpPath
      });

      const textColor = this.imageTemplate.color;

      Promise.all([imageDownloadPromise, fontDownloadPromise])
        .then(() => {
          // Build from template
          template(imageTmpPath, fontTmpPath, textColor).write(
            imageTmpPath,
            error => {
              // Error saving file
              if (error) {
                reject(error);
                return;
              }
              // Upload file back to bucket
              bucket
                .upload(imageTmpPath, { destination: imageOutputPath })
                .then(upFile => {
                  // remove temp assets
                  fs.unlinkSync(fontTmpPath);
                  fs.unlinkSync(imageTmpPath);

                  // Get Signed URL
                  const config = {
                    action: 'read',
                    expires: '01-01-2030'
                  };
                  return upFile[0].getSignedUrl(config);
                })
                // Save URL and save as public
                .then(url => {
                  if (Array.isArray(url)) {
                    url = url[0];
                  }
                  this.url = url;
                  this.isPublic = true;
                  return this.update();
                })
                // Return asset url so it can be displayed in the flow
                .then(() => {
                  resolve(this);
                })
                .catch(error => {
                  reject(error);
                });
            }
          );
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = Card;
