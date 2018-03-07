'use strict';

const cardCreationResponse = require('../responses/card-creation');
const { contexts } = require('../constants');

/*

  5.1 -

*/
module.exports = app => {
  let cardDesign = app.getSelectedOption();

  app.setContext(contexts.SELECT_TONE, 0);

  if (cardCreationResponse.validateCardDesign(cardDesign)) {
    app.user.cardState = 'design';
    app.user.cardDesign = cardDesign;

    if (app.user.cardTone == 'custom') {
      // no text
      app.user.cardText = 0;
      app.user.update();

      app.setContext(contexts.INPUT_MESSAGE, 3);
      app.setContext(contexts.SELECT_DESIGN, 0);

      // By pass text selection flow if we're on custom card
      return cardCreationResponse.addMessage(app);
    } else {
      // default text
      app.user.cardText = 0;
      app.user.update();
      // show default text switch flow
      return cardCreationResponse.selectedDesign(
        app,
        app.user.cardTone,
        cardDesign,
        app.user.cardText
      );
    }
  } else {
    app.ask('Error');
  }
};
