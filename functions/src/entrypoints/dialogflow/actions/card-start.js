'use strict';

const cardCreationResponse = require('../responses/card-creation');

/*

  4.0 -- input.start

  Creates a start card creation prompt that varies based on how
  many cards the user has previously created.

  Output context : select_tone
*/
module.exports = app => {
  // The number of cards the user has created is used to
  // customize the 'start card' intro message
  let cards;
  try {
    cards = parseInt(app.user.cards, 10);
  } catch (e) {
    cards = 0;
  }

  // We persist what card was last created so we can
  // 'share last card' or 'show latest', but this gets
  // wiped when we start a new card
  if (app.user.cardId !== null) {
    app.user.reset();
  }

  return cardCreationResponse.startCard(app, cards);
};
