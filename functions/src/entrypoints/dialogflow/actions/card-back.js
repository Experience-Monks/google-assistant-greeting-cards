'use strict';

const cardCreationResponse = require('../responses/card-creation');

/*

*/
module.exports = app => {
  let contexts = app.getContexts();
  console.warn(contexts);
  const response = app.buildRichResponse();
  response.addSimpleResponse('GO BACK.');
  return app.ask(response);
};
