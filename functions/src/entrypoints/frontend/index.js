'use strict';

const functions = require('firebase-functions');
const sanitizeHtml = require('sanitize-html');
const express = require('express');
const expressSanitizer = require('express-sanitizer');

const Card = require('../../model/card');

const html = require('./view');

const shareApp = express();
shareApp.use(expressSanitizer());

shareApp.get('*', (request, response) => {
  const cardId = sanitizeHtml(request.sanitize(request.query.cardId));

  const card = new Card();
  card
    .loadById(cardId)
    .then(() => {
      console.log('card', card);
      if (card.exists) {
        const url =
          `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com` +
          request.originalUrl;
        const htmlResult =
          html.header(url, card) + html.success(url, card) + html.footer();
        response.status(200).send(htmlResult);
      } else {
        response.status(400).send('false');
      }
      // const plant = garden.getPlantByDay(plantDay);
      // if (!plant) throw new Error('Plant not found.');
      // const url = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com` + request.originalUrl;
      // const htmlResult = html.header(url, plant) + html.success(url, plant, plantDay) + html.footer();
    })
    .catch(err => {
      console.error('Share Error:', err);
      const htmlResult = html.header() + html.error() + html.footer();
      response.status(503).send(htmlResult);
    });
  //response.status(200).send(cardId);

  //let htmlResult = html.header() + html.success() + html.footer();

  //response.status(200).send(htmlResult);

  /*
  garden.loadById(gardenId)
  .then(() => {
    const plant = garden.getPlantByDay(plantDay);
    if (!plant) throw new Error('Plant not found.');
    const url = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com` + request.originalUrl;
    const htmlResult = html.header(url, plant) + html.success(url, plant, plantDay) + html.footer();
    response.status(200).send(htmlResult);
  })
  .catch(err => {
    console.error('Share Error:', err);
    const htmlResult = html.header() + html.error() + html.footer();
    response.status(503).send(htmlResult);
  });
*/
});

module.exports = functions.https.onRequest(shareApp);
