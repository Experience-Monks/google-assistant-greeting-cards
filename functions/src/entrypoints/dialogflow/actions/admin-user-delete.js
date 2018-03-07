'use strict';

const { TOKEN_FOR_USER_ID } = require('../../../config');
const fallbackResponse = require('../responses/fallback');
const errorResponse = require('../responses/error');
const db = require('../../../utils/admin').db;

module.exports = app => {
  const { user } = app;

  //if (user.isAdmin) {
  user
    .delete()
    .then(() => {
      db
        .collection('cards')
        .where('userId', '==', app.user.getId())
        .get()
        .then(querySnapshot => {
          let promises = [];
          querySnapshot.forEach(function(doc) {
            promises.push(
              db
                .collection('cards')
                .doc(doc.id)
                .update({ isPublic: false })
            );
          });
        })
        .catch(error => {
          console.error(error);
          errorResponse.general(app);
        });
    })
    .then(() => {
      app.tell('User deleted, restart the app.');
    })
    .catch(error => {
      console.error(error);
      app.tell('Could not delete user.');
    });
};
