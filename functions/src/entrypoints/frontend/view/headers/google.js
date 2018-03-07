'use strict';

const constants = require('../../constants');

module.exports = card => {
  return `<!-- Schema.org markup for Google+ -->
<meta itemprop="name" content="${constants.title}">
<meta itemprop="description" content="${constants.description}">
<meta itemprop="image" content="${card.url}">`;
};
