'use strict';

const constants = require('../../constants');

module.exports = (url, card) => {
  return `<!-- Open Graph data -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${constants.title}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${card.url}" />
    <meta property="og:description" content="${constants.description}" />`;
};
