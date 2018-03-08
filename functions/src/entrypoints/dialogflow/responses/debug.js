'use strict';

const utils = require('../../../utils/utils');
const { strings } = require('../constants');

const normalResponse = (app, copy) => {
  const response = app.buildRichResponse();
  const firstResponse = utils.randomString(copy);
  response.addSimpleResponse(firstResponse);
  app.ask(response);
};

module.exports.initial = app => {
  const { initial: copy } = strings.debug;
  normalResponse(app, copy);
};
