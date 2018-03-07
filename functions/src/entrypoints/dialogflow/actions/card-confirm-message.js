'use strict';

const cardCreationResponse = require('../responses/card-creation');
const errorResponse = require('../responses/error');
const cardGeneratorService = require('../services/generate-card');

/*



*/
module.exports = app => {
  // Confirmed to enter message
  if (app.getUserConfirmation() === true) {
    cardCreationResponse.addMessage(app);
  } else if (app.getUserConfirmation() === false) {
    app.user.message = '';
    app.user.update();

    app.setContext('input_message', 0);

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

    // Put in fallback and ask again
  } else {
    // THIS NEVER GETS CALLED???
    cardCreationResponse.promptUserMessage(app);
  }
};
