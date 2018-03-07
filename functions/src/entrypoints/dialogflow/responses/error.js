'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');

module.exports.general = app => {
  const { general: copy } = strings.error;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.ask(response);
};

module.exports.fatal = app => {
  const { fatal: copy } = strings.error;
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.tell(response);
};

module.exports.cardCreationError = (app, error) => {
  console.error(error);
  const response = app.buildRichResponse();
  response.addSimpleResponse(
    'There was an error creating your card. Try again later.'
  );
  app.ask(response);
};
