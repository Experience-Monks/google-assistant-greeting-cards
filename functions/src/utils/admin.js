'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (process.env.FUNCTIONS_EMULATOR) {
  const serviceAccount = require(`../../.credential-${
    process.env.GCLOUD_PROJECT
  }.json`);

  functions.config = function() {
    return {
      firebase: {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
        storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`
      }
    };
  };
} else {
  process.env.PROJECT_ENV = functions.config().project.project_env;
  process.env.GCLOUD_PROJECT = functions.config().project.gcloud_project;
  process.env.PROJECT_SENDER_ID = functions.config().project.project_sender_id;
  process.env.SECURITY_HEADER = functions.config().project.security_header;
}

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const storage = admin.storage();

/**
 * @type {{db: admin.firestore.Firestore, admin: admin}}
 */
module.exports = {
  db,
  storage,
  admin
};
