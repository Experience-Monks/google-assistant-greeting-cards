'use strict';

const keys = require('./keys');

// start
const startPoint = require('./start-point');

// Card creation
const cardStart = require('./card-start');
const cardSelectedTone = require('./card-selected-tone');
const cardSelectedDesign = require('./card-selected-design');
const cardInputMessage = require('./card-input-message');
const cardConfirmMessage = require('./card-confirm-message');

// Card switched
const cardSwitchText = require('./card-switch-text');
const cardSwitchNext = require('./card-switch-next');
// Undo
const cardBack = require('./card-back');

const enterSignature = require('./sign');
const signed = require('./signed');

// Outside of flow
const share = require('./share');
const showLatest = require('./latest-cards');
const showCard = require('./show-card');
const fallback = require('./fallback');
const menu = require('./menu');

const adminUserDelete = require('./admin-user-delete');
const adminUserGetId = require('./admin-user-get-id');

const map = new Map();
map.set(keys.WELCOME, startPoint);

map.set(keys.FALLBACK, fallback);
map.set(keys.MENU, menu);

// Card flow
map.set(keys.CARD_START, cardStart);
map.set(keys.CARD_SELECTED_TONE, cardSelectedTone);
map.set(keys.CARD_SELECTED_DESIGN, cardSelectedDesign);
map.set(keys.CARD_INPUT_MESSAGE, cardInputMessage);

map.set(keys.NEW_SURFACE, cardStart);
//map.set('card.back', cardBack);

map.set(keys.CARD_SWITCH_TEXT, cardSwitchText);
map.set(keys.CARD_SWITCH_CONFIRM, cardSwitchNext);
map.set(keys.CARD_CONFIRM_MESSAGE, cardConfirmMessage);

map.set(keys.INPUT_SIGN, enterSignature);
map.set(keys.INPUT_SIGNED, signed);

// Outside of flow
map.set(keys.SHARE_CARD, share);
map.set(keys.LATEST_CARDS, showLatest);
map.set(keys.LATEST_CARDS_OPTION, showCard);

map.set(keys.ADMIN_USER_DELETE, adminUserDelete);
map.set(keys.ADMIN_USER_GET_ID, adminUserGetId);

/*
  ==========
  CARD NEXT
*/
// let card_next = app => {
//   const response = app.buildRichResponse();
//   response.addSimpleResponse('GOING TO NEXT');
//   return app.ask(response);
// };
// map.set('card.next', card_next);

module.exports = map;
