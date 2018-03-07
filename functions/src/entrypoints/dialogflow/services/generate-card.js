'use strict';

const Card = require('../../../model/card');
//
//
module.exports.create = app => {
  return new Promise((resolve, reject) => {
    var card = new Card();
    card
      .createFromUser(app.user)
      .then(_card => {
        return _card.render();
      })
      .then(_card => {
        resolve(_card);
      })
      .catch(error => {
        console.error('ERROR', error);
        reject(error);
      });
  });
};
