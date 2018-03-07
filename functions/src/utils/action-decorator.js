'use strict';

module.exports = action => {
  return app => {
    const { user } = app;

    if (!user.exists) {
      throw new Error('User does not exist');
    } else {
      action(app);
    }
  };
};
