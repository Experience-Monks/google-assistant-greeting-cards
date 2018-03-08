'use strict';

const cardCreationResponse = require('../responses/card-creation');

/*



*/
module.exports = app => {
  console.log('CARD:SELECTED TEXTS');

  const response = app.buildRichResponse();
  let card_change = parseInt(app.getArgument('card_change'), 10);
  let card_variant = app.getArgument('card_variant');

  console.warn(card_variant, card_change);

  app.user.cardText += card_change;

  // Old switch it up cycle through functionality. Do we keep this?
  if (typeof card_variant !== 'string') {
    if (app.user.cardText > 4) {
      app.user.cardText = 4;
      response.addSimpleResponse(
        'Slow it down buckaroo, I only have so many options.'
      );
    } else if (app.user.cardText < 0) {
      app.user.cardText = 0;
      response.addSimpleResponse(
        'Slow it down buckaroo, I only have so many options.'
      );
    }
    app.user.update();
    return cardCreationResponse.switchedText(
      app,
      app.user.cardTone,
      app.user.cardDesign,
      app.user.cardText
    );

    // Variants of the card
  } else {
    let index = cardCreationResponse.cardVariantToText(
      app.user.cardDesign,
      card_variant
    );
    console.warn('index', index);
    if (index >= 0) {
      app.user.cardText = index;
    }

    app.user.update();
    return cardCreationResponse.switchedText(
      app,
      app.user.cardTone,
      app.user.cardDesign,
      app.user.cardText
    );
  }
  //return app.ask(response);
};
