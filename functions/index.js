'use strict';

require('dotenv').config({ path: __dirname + '/.env' });
require('./src/utils/admin');
const fulfillmentEntryPoint = require('./src/entrypoints/dialogflow');
const frontendEntryPoint = require('./src/entrypoints/frontend');

module.exports.fulfillmentEntryPoint = fulfillmentEntryPoint;
module.exports.shareCard = frontendEntryPoint;
