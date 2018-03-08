'use strict';

const log = require('../../../log-controller');
const errorResponse = require('../responses/error');
const welcomeResponse = require('../responses/welcome');

module.exports = (app) => {
  const {user} = app;

  if (!user.exists) {
    log.info('StartPoint: user does not exist', {user: app.getUser().userId});
    user.create(app.getUser().userId)
      .then(() => {
        log.info('StartPoint: user created', {user: user.getId()});
        return welcomeResponse.onboarding(app);
      })
      .catch(err => {
        log.error('StartPoint: error', {error: err});
        errorResponse.fatal(app);
      });
  } else {
    log.info('StartPoint: user exist', {user: user.getId()});
    welcomeResponse.welcome(app);
  }
};

