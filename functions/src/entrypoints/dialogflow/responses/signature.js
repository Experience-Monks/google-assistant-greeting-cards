'use strict';

const { strings } = require('../constants');

/*
Prompt
*/
module.exports.prompt = app => {
  const { prompt } = strings.signature;
  const response = app.buildRichResponse();
  response.addSimpleResponse(prompt.intro);
  return app.ask(response);
};
/*
Success
*/
module.exports.success = (app, signature) => {
  const { success } = strings.signature;
  const response = app.buildRichResponse();
  let responseText = success.intro.replace(/%sig/, signature);
  response.addSimpleResponse(responseText);
  return app.ask(response);
};
/*
Error messages
*/
module.exports.errorLength = app => {
  const { error } = strings.signature;
  const response = app.buildRichResponse();
  response.addSimpleResponse(error.length);
  return app.ask(response);
};
module.exports.errorContent = app => {
  const { error } = strings.signature;
  const response = app.buildRichResponse();
  response.addSimpleResponse(error.content);
  return app.ask(response);
};
