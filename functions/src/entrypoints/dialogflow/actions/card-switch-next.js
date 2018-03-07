'use strict';

const cardCreationResponse = require('../responses/card-creation');

/*


*/
module.exports = app => {
  app.setContext('prompt_message', 1);
  cardCreationResponse.promptUserMessage(app);
};
