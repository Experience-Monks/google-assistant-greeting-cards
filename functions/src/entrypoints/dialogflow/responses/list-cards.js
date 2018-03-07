'use strict';

const { strings } = require('../constants');
const Card = require('../../../model/card');
const { SHARE_URL } = require('../../../config');

/*


*/
function createCardListItem(app, index, id, url, message = '') {
  const { general } = strings;
  if (message === '') {
    message = '(No message)';
  }
  let card = app
    .buildOptionItem(id, [String(index)])
    .setTitle('Card ' + index)
    .setDescription(message);
  card.setImage(url, general.your_card);
  return card;
}

function addSimpleResponse(response, message) {
  if (Array.isArray(message)) {
    response.addSimpleResponse(
      message[Math.floor(message.length * Math.random())]
    );
  }
  return response.addSimpleResponse(message);
}

function sortCards(cards) {
  return cards.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });
}

function limitCards(cards, limit) {
  if (limit > 0 && Array.isArray(cards)) {
    return cards.slice(0, limit);
  }
  return cards;
}

/*
  Returns a DialogFlow Image Card from url
*/
function createCardResponseFromURL(app, message, url = '') {
  const { general } = strings;
  if (message === '') {
    message = '(No message.)';
  }
  return app
    .buildBasicCard(message)
    .setSubtitle(general.you_wrote)
    .setImage(url, general.your_card)
    .setImageDisplay('WHITE');
}

module.exports.showCard = (app, card) => {
  const { share } = strings.card;
  const { general } = strings;
  const response = app.buildRichResponse();
  const cardId = card.getId();
  addSimpleResponse(response, general.heres_your_card);

  let cardResponse = createCardResponseFromURL(app, card.message, card.url);
  if (card.isPublic) {
    cardResponse.addButton(general.share_your_card, SHARE_URL + cardId);
  }
  response.addBasicCard(cardResponse);
  response.addSuggestions(share.suggestions);
  return app.ask(response);
};

/*



*/
module.exports.listCards = (app, cards = [], limit) => {
  const { latest } = strings;
  const response = app.buildRichResponse();
  const cardCount = cards.length;

  if (limit == null) {
    limit = Math.min(cardCount, 30);
  }

  if (cardCount > 1 && limit > 1) {
    cards = sortCards(cards);
    cards = limitCards(cards, limit);

    addSimpleResponse(
      response,
      'Wow! You have made a total of ' +
        cardCount +
        " cards. Here's the most recent " +
        cards.length
    );
    let list = app.buildList('Most recent ' + cards.length + ' cards.');
    for (let i = 0; i < cards.length; i++) {
      list.addItems(
        createCardListItem(
          app,
          i + 1,
          cards[i].id,
          cards[i].url,
          cards[i].message
        )
      );
    }

    return app.askWithList(response, list);
  } else if (cardCount > 0 || limit == 1) {
    if (cardCount == 1) {
      addSimpleResponse(response, 'You have made one card. Here it is:');
    } else {
      addSimpleResponse(
        response,
        'Wow! You have made a total of ' +
          cardCount +
          " cards. Here's the most recent one."
      );
    }

    const cardId = cards[0].id;
    response.addBasicCard(
      createCardResponseFromURL(app, cards[0].message, cards[0].url).addButton(
        'share your card',
        SHARE_URL + cardId
      )
    );

    return app.ask(response);
  } else {
    addSimpleResponse(response, 'You have not made any cards');
    response.addSuggestions(['Start a new card', 'help']);
    return app.ask(response);
  }
};
