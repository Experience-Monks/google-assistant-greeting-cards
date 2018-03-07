'use strict';

//const utils = require('../../../utils/utils');
const { strings } = require('../constants');
const msf = require('../../../utils/multi-surface');
const { SHARE_URL } = require('../../../config');

/*

*/
function cardWithSimpleResponse(app, cardResponse, textRef, suggestions = []) {
  const response = app.buildRichResponse();

  if (typeof textRef.success !== 'undefined') {
    addSimpleResponse(response, textRef.success);
  }

  // Show the card as is
  response.addBasicCard(cardResponse);
  if (Array.isArray(textRef.suggestions)) {
    response.addSuggestions(textRef.suggestions.concat(suggestions));
  }
  return app.ask(response);
}

function createCardPreviewUrl(designId = '', textId = 0) {
  const { templates } = strings;
  const img = templates.images[designId];
  let url = templates.previews.url;
  if (Array.isArray(img.names) && typeof img.names[textId] === 'string') {
    url += img.names[textId] + templates.previews.ext;
  } else {
    url += '404.jpg';
  }
  return url;
}

function cardPreviewUrl(designId = '') {
  const { templates } = strings;
  const img = templates.images[designId];
  const url = templates.previews.url;
  //
  if (typeof img.preview === 'string') {
    return url + img.preview + templates.previews.ext;
  } else {
    return createCardPreviewUrl(designId);
  }
}

/*
  Returns a DialogFlow Image Card from template
*/
function createBasicCard(app, designId = '', textId = 0, message = '') {
  const url = createCardPreviewUrl(designId, textId);
  return (
    app
      .buildBasicCard(message)
      //.setTitle(img.texts[textId])
      .setImage(url, 'Your card')
      .setImageDisplay('WHITE')
  );
}

/*
  Returns a DialogFlow Image Card from url
*/
function createBasicCardFromURL(app, responseText = '', url = '') {
  const { general } = strings;
  if (responseText === '') {
    responseText = general.heres_your_card;
  }
  return app
    .buildBasicCard(responseText)
    .setImage(url, 'Your card')
    .setImageDisplay('WHITE');
}

//
function validateCardDesign(designId) {
  const { templates } = strings;
  return Object.keys(templates.images).includes(designId);
}
/*

*/
function cardVariantToText(designId, variant) {
  const { templates } = strings;
  if (Object.keys(templates.images).includes(designId)) {
    return Object.keys(templates.images[designId].texts).indexOf(variant);
  }
}

function getSuggestionsForDesign(tone = '') {
  const { templates } = strings;

  if (Array.isArray(templates.suggestions[tone])) {
    return templates.suggestions[tone];
  }
  return [];
}

//
//
//
function addSimpleResponse(response, message) {
  if (Array.isArray(message)) {
    response.addSimpleResponse(
      message[Math.floor(message.length * Math.random())]
    );
  }
  return response.addSimpleResponse(message);
}

/*
 Given a string designId returns whether it's valid (in copy)
*/
module.exports.validateCardDesign = validateCardDesign;

/*

*/
module.exports.cardVariantToText = cardVariantToText;

function startOnPhone(app, userCardsCreated) {
  const copy = strings.card.start;
  const response = app.buildRichResponse();
  if (userCardsCreated == 0) {
    addSimpleResponse(response, copy.intro[0]);
  } else if (userCardsCreated == 1) {
    addSimpleResponse(response, copy.intro[1]);
  } else if (userCardsCreated > 1 && userCardsCreated < 5) {
    addSimpleResponse(response, copy.intro[2]);
  } else {
    addSimpleResponse(response, copy.intro[3]);
  }
  addSimpleResponse(response, copy.prompt);
  response.addSuggestions(copy.suggestions);
  return app.ask(response);
}
/*

  04.0
  Simple response to 'start a card'
  Returns contextual response based on how many cards have been created
  Followed by a prompt for type of card

*/
module.exports.startCard = (app, userCardsCreated) => {
  const { changeSurface } = strings.card;
  const multiSurface = msf(app);

  if (multiSurface.hasScreen) {
    startOnPhone(app, userCardsCreated);
  } else if (multiSurface.hasAvailableScreen) {
    const contextName = 'new_surface';
    multiSurface.askForNewSurface(
      changeSurface.message,
      changeSurface.notification,
      contextName
    );
  } else {
    const response = app.buildRichResponse();
    response.addSimpleResponse(changeSurface.noScreens);
    //lastPromptResponse.add(app, response);
    app.tell(response);
  }
};

/*
  05.1
  Shows available designs for the specified 'tone'

*/
module.exports.selectDesignCarousel = (app, tone) => {
  const { templates, card } = strings;
  let carousel = app.buildCarousel();

  // Just make sure it's a supported tone
  if (Array.isArray(templates.options[tone]) === false) {
    return app.ask('Error in tone.'); // TODO
  }
  const options = templates.options[tone];
  options.forEach((option, index) => {
    let item = templates.images[option];
    let labels = item.labels.map(str => {
      return str.replace(/%i/, index + 1);
    });
    // Make carousel item
    let optionItem = app
      .buildOptionItem(String(option), labels)
      .setTitle(item.title)
      .setImage(cardPreviewUrl(option), item.alt);
    carousel.addItems(optionItem);
  });
  return app.askWithCarousel(card.design.select, carousel);
};

/*

  05.2

*/
module.exports.selectedDesign = (app, tone = '', designId = '', textId = 0) => {
  const { design } = strings.card;
  const suggestionsFor = getSuggestionsForDesign(tone);
  let response = cardWithSimpleResponse(
    app,
    createBasicCard(app, designId, textId),
    design,
    suggestionsFor
  );
  return app.ask(response);
};

module.exports.switchedText = (app, tone = '', designId = '', textId = 0) => {
  const { switched } = strings.card;
  const suggestionsFor = getSuggestionsForDesign(tone);
  let response = cardWithSimpleResponse(
    app,
    createBasicCard(app, designId, textId),
    switched,
    suggestionsFor
  );
  return app.ask(response);
};

/*

  Prompt user to enter user message
*/
module.exports.promptUserMessage = app => {
  const { messagePrompt } = strings.card;
  app.setContext('confirm_message');
  return app.askForConfirmation(messagePrompt.intro);
};

/*

  Add message
*/
module.exports.addMessage = app => {
  const { message } = strings.card;
  const response = app.buildRichResponse();
  // Set to confirm message context
  app.setContext('input_message', 3);
  addSimpleResponse(response, message.intro);
  //response.addSuggestions(message.suggestions);
  return app.ask(response);
};

/*
Error messages
*/
module.exports.messageErrorLength = app => {
  const { messageError } = strings.card;
  const response = app.buildRichResponse();
  addSimpleResponse(response, messageError.length);
  return app.ask(response);
};
module.exports.messageErrorContent = app => {
  const { messageError } = strings.card;
  const response = app.buildRichResponse();
  addSimpleResponse(response, messageError.content);
  return app.ask(response);
};

/*

  Card Specific Share, triggered only from
  share flow after creation.

*/
module.exports.created = (app, card) => {
  const { share } = strings.card;
  const cardId = card.getId();
  const response = app.buildRichResponse();
  addSimpleResponse(response, share.intro);
  response.addBasicCard(
    createBasicCardFromURL(app, card.message, card.url).addButton(
      share.share_link,
      SHARE_URL + cardId
    )
  );
  response.addSuggestions(share.suggestions);
  return app.ask(response);
};

/*

  Generic Share, triggered from any context, if a card is present.

*/
module.exports.share = (app, imageUrl, cardId) => {
  const { card } = strings.share;
  const response = app.buildRichResponse();
  addSimpleResponse(response, card.intro);
  response.addBasicCard(
    createBasicCardFromURL(app, '', imageUrl).addButton(
      card.share_link,
      SHARE_URL + cardId
    )
  );
  response.addSuggestions(card.suggestions);
  return app.ask(response);
};

/*

  Generic share when triggered from any context, if NO card
  is present.

*/
module.exports.shareUnavailable = app => {
  const { nocard } = strings.share;
  const response = app.buildRichResponse();
  addSimpleResponse(response, nocard.intro);
  response.addSuggestions(nocard.suggestions);
  return app.ask(response);
};
