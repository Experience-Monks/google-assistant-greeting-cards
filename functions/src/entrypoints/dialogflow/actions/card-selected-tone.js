'use strict';

const cardCreationResponse = require('../responses/card-creation');

/*

  4.x -- card.selected_tone

  Expects context of select_tone and a parameter of card_tone

  If it's a valid option shows a carousel of various card designs. User
  should click one.

*/
module.exports = app => {
  let context = app.getContext('select_tone');
  if (context == null) {
    return app.ask('Missing context.');
  }

  app.user.cardTone = context.parameters.card_tone;
  app.user.cardState = 'tone';
  app.user.update();

  return cardCreationResponse.selectDesignCarousel(
    app,
    context.parameters.card_tone
  );
};
