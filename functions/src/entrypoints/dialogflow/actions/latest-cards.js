'use strict';

const listCardsResponse = require('../responses/list-cards');
const errorResponse = require('../responses/error');
const db = require('../../../utils/admin').db;

/*



*/
// TODO: ABSTRACT OUT DB FROM HERE
module.exports = app => {
  // How many cards to show
  let num_cards = app.getArgument('show_count');
  if (num_cards === null) {
    num_cards = null;
  } else {
    num_cards = parseInt(num_cards, 10);
  }

  let dbRef = db
    .collection('cards')
    .where('userId', '==', app.user.getId())
    .get()
    .then(querySnapshot => {
      let cards = [];
      querySnapshot.forEach(function(doc) {
        let card = doc.data();
        card.id = doc.id;
        if (card.isPublic === true) {
          cards.push(card);
        }
      });
      return listCardsResponse.listCards(app, cards, num_cards);
    })
    .catch(error => {
      console.error(error);
      errorResponse.general(app);
    });
};
