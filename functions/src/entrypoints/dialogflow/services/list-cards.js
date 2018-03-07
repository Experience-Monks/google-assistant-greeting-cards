'use strict';
const db = require('../../../utils/admin').db;
const Card = require('../../../model/card');

module.exports.create = (app, cardState = '') => {
  let dbRef = db
    .collection('cards')
    .doc(app.user.getId())
    .collection('cards')
    .get()
    .then(querySnapshot => {
      let cards = [];
      querySnapshot.forEach(function(doc) {
        cards.push(doc.data());
      });
    });
};
