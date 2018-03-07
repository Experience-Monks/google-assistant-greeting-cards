'use strict';

const cardCreationResponse = require('../responses/card-creation');
const errorResponse = require('../responses/error');
const cardGeneratorService = require('../services/generate-card');

const { contexts } = require('../constants');
const { check: hasProfanity } = require('../../../utils/profanity-filter');

/*



*/
module.exports = app => {
  const message = app.getRawInput();

  if (message.length > 72) {
    cardCreationResponse.messageErrorLength(app);
    app.setContext(contexts.INPUT_MESSAGE, 3);
  } else if (hasProfanity(message)) {
    app.setContext(contexts.INPUT_MESSAGE, 3);
    cardCreationResponse.messageErrorContent(app);
  } else {
    app.setContext(contexts.INPUT_MESSAGE, 0);

    app.user.cardState = 'message';
    app.user.cardMessage = message;

    var card = null;
    // creating card
    cardGeneratorService
      .create(app)
      .then(_card => {
        card = _card;
        // Update user
        app.user.cardId = card.getId();
        app.user.cards = app.user.cards + 1;
        return app.user.update();
      })
      .then(() => {
        cardCreationResponse.created(app, card);
      })
      .catch(error => {
        console.error(error);
        errorResponse.cardCreationError(app, error);
      });
  }
};
