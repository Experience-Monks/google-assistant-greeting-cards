'use strict';

const listCardsResponse = require('../responses/list-cards');
const errorResponse = require('../responses/error');

const Card = require('../../../model/card');

/*



*/
module.exports = app => {
  let cardId = app.getSelectedOption();

  console.warn(cardId);
  let card = new Card(app.user.getId());

  card
    .loadById(cardId)
    .then(() => {
      return listCardsResponse.showCard(app, card);
    })
    .catch(error => {
      console.error(error);
      errorResponse.general(app);
    });
};
