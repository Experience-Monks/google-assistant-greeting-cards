'use strict';

const cardCreationResponse = require('../responses/card-creation');
const Card = require('../../../model/card');

/*



*/
module.exports = app => {
  console.log('CARD:SHARE');

  const response = app.buildRichResponse();
  const cardId = app.user.cardId;

  let card = new Card(app.user.getId());

  if (cardId) {
    card
      .loadById(cardId)
      .then(() => {
        cardCreationResponse.shareCard(app, card.url, cardId);
      })
      .catch(error => {
        console.error(error);
        return app.ask(response.addSimpleResponse('ERROR: ' + cardId));
      });
  } else {
    cardCreationResponse.shareUnavailable(app);
  }
};
