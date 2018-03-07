'use strict';

const signatureResponse = require('../responses/signature');

/*

*/
module.exports = app => {
  //const response = app.buildRichResponse();

  //app.setContext('prompt_signature', 2);
  //response.addSimpleResponse('Enter your signature now:');
  signatureResponse.prompt(app);
  //return app.ask(response);
};
