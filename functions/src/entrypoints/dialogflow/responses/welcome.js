'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  response.addSuggestions(['start a new card', 'menu']);
  app.ask(response);
};

module.exports.onboarding = app => {
  const { onboarding: copy } = strings.welcome;
  normalResponse(app, copy);
};

module.exports.welcome = app => {
  const { welcome: copy } = strings.welcome;
  normalResponse(app, copy);
};
