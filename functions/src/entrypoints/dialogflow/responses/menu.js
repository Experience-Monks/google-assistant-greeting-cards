'use strict';
const { strings } = require('../constants');

module.exports.menu = app => {
  const { help } = strings;
  const response = app.buildRichResponse();
  response.addSimpleResponse(help.intro);
  response.addSuggestions(help.suggestions);
  app.ask(response);
};
