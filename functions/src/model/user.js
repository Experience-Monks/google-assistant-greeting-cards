'use strict';

const { db } = require('../utils/admin');
const Log = require('../log-controller');

const COLLECTION = 'users';

class User {
  static get COLLECTION() {
    return COLLECTION;
  }

  constructor() {
    this.id = 0;
    this.exists = false;
    this.cards = 0;

    this.createdAt = null;
    this.signature = null;
    this.docRef = null;
  }

  setCardDefaults() {
    this.cardTone = null;
    this.cardDesign = null;
    this.cardText = null;
    this.cardState = null;
    this.cardMessage = '';
    this.cardId = null; // Active card id. When 'created' but not fully confirmed
  }

  getId() {
    return this.id;
  }

  get data() {
    return {
      cards: this.cards,
      signature: this.signature,
      createdAt: this.createdAt,
      cardState: this.cardState,
      cardTone: this.cardTone,
      cardDesign: this.cardDesign,
      cardText: this.cardText,
      cardMessage: this.cardMessage,
      cardId: this.cardId
    };
  }

  reset() {
    this.setCardDefaults();
    return this.update();
  }

  set data(obj) {
    Object.keys(obj).forEach(prop => {
      this[prop] = obj[prop];
    });
  }

  getDocRef(id) {
    if (!this.docRef) {
      this.docRef = db.doc(`${COLLECTION}/${id}`);
    }
    return this.docRef;
  }

  create(id) {
    const obj = {
      createdAt: Date.now(),
      cards: 0
    };

    return this.getDocRef(id)
      .set(obj)
      .then(() => {
        this.id = id;
        this.exists = true;
        this.data = obj;
      })
      .catch(err => {
        throw err;
      });
  }

  update() {
    return this.getDocRef(this.id)
      .update(this.data)
      .then(updateResult => {
        Log.info('update: Update', { update_result: updateResult });
        return updateResult;
      })
      .catch(err => {
        Log.info('update: Error', { exception: err });
        // return false;
        throw err;
      });
  }

  delete() {
    return this.getDocRef(this.id)
      .delete()
      .then(deleteResult => {
        Log.info('delete: Delete', { delete: deleteResult });
        return deleteResult;
      })
      .catch(err => {
        Log.info('delete: Error', { exception: err });
        throw err;
      });
  }

  loadById(id) {
    return this.getDocRef(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.exists = true;
          this.id = id;
          this.data = doc.data();
        }
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Check if the user exist in the database
   *
   * @param userId
   */
  existUser(userId) {
    userId = userId || this.app_user.userId;
    return new Promise(resolve => {
      console.log('existUser: ' + userId);
      this.getUser(userId)
        .then(user_data => {
          resolve(user_data);
        })
        .catch(err => {
          console.log('existUser: Error', err);
          resolve(false);
        });
    });
  }
}

module.exports = User;
