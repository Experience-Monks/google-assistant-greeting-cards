'use strict';

const signatureResponse = require('../responses/signature');
const { check: hasProfanity } = require('../../../utils/profanity-filter');

/*

*/
module.exports = app => {
  const signature = app.getRawInput();
  const response = app.buildRichResponse();

  if (signature.length > 12) {
    signatureResponse.errorLength(app);
    //app.setContext('prompt_signature', 1);
    response.errorLength(app);
  } else if (hasProfanity(signature)) {
    //app.setContext('prompt_signature', 1);
    signatureResponse.errorContent(app);
  } else {
    app.setContext('prompt_signature', 0);
    signatureResponse.success(app, signature);
    //
  }
  return app.ask(response);
};
