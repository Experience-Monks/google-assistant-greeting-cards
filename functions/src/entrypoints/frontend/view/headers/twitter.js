'use strict';

const constants = require('../../constants');

module.exports = card => {
  return `<!-- Twitter Card data -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${constants.title}">
<meta name="twitter:description" content="${constants.description}">
<meta name="twitter:image:src" content="${card.url}">`;
};
