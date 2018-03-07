'use strict';

const functions = require('firebase-functions');
const GreetingApp = require('./app/greeting-app');

/*
 Entry point for DialogFlow API.
*/
module.exports = functions.https.onRequest((request, response) => {
  const securityHeader = request.headers['x-security-content'];
  if (securityHeader === process.env.SECURITY_HEADER) {
    const app = new GreetingApp({ request, response });
    app.run();
  } else {
    response.status(401).send('Sorry. ');
  }
});
