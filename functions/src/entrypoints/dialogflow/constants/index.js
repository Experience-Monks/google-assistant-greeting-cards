'use strict';

const strings = require('../json/copy');
const contexts = require('./contexts');
const options = require('./options');
const appUrl = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/`;

/**
 * @type {{strings, contexts: {createGarden: string, selectPlantInList: string}, options: {createGardenOptions: {BLUE: string, PINK: string}}, appUrl: string}}
 */
module.exports = {
  strings,
  contexts,
  options,
  appUrl
};
