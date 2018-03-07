'use strict';

require('dotenv').config();
const functions = require('firebase-functions');

let GCLOUD_PROJECT;
let PROJECT_ENV;
let SECURITY_HEADER;
let TOKEN_FOR_USER_ID;
const FUNCTIONS_EMULATOR = process.env.FUNCTIONS_EMULATOR === 'true';

if (FUNCTIONS_EMULATOR === true) {
  GCLOUD_PROJECT = process.env.GCLOUD_PROJECT;
  PROJECT_ENV = process.env.PROJECT_ENV;
  SECURITY_HEADER = process.env.SECURITY_HEADER;
  TOKEN_FOR_USER_ID = process.env.TOKEN_FOR_USER_ID;
} else {
  GCLOUD_PROJECT = functions.config().project.gcloud_project;
  PROJECT_ENV = functions.config().project.project_env;
  SECURITY_HEADER = functions.config().project.security_header;
  TOKEN_FOR_USER_ID = functions.config().project.token_for_user_id;
}
const APP_URL = `https://${GCLOUD_PROJECT}.firebaseapp.com/`;
const SHARE_URL = `${APP_URL}?cardId=`;

module.exports = {
  APP_URL,
  SHARE_URL,
  FUNCTIONS_EMULATOR,
  GCLOUD_PROJECT,
  PROJECT_ENV,
  SECURITY_HEADER,
  TOKEN_FOR_USER_ID
};
