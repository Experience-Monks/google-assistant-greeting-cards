'use strict';

const { TOKEN_FOR_USER_ID } = require('../../../config');
const fallbackResponse = require('../responses/fallback');

module.exports = app => {
  const { user } = app;
  const token = app.getArgument('token');
  console.warn(token, TOKEN_FOR_USER_ID);
  if (typeof token === 'string' && token === TOKEN_FOR_USER_ID) {
    app.ask({
      speech: 'Your Id',
      displayText: user.getId()
    });
  } else {
    fallbackResponse.fallback(app);
  }
};
