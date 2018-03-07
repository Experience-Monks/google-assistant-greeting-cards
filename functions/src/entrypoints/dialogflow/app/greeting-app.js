'use strict';

const Debug = require('debug');
const debug = Debug('actions-on-google:debug');
const error = Debug('actions-on-google:error');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const actions = require('../actions');
const User = require('../../../model/user');
const errorResponse = require('../responses/error');

const RESPONSE_CODE_OK = 200;

/**
 * Check if given text contains SSML.
 *
 * @param {string} text Text to check.
 * @return {boolean} True if text contains SSML, false otherwise.
 */
const isSsml = text => /^<speak\b[^>]*>([^]*?)<\/speak>$/gi.test(text);

/**
 * Check if given text contains SSML, allowing for whitespace padding.
 *
 * @param {string} text Text to check.
 * @return {boolean} True if text contains possibly whitespace padded SSML,
 *     false otherwise.
 */
const isPaddedSsml = text =>
  /^\s*<speak\b[^>]*>([^]*?)<\/speak>\s*$/gi.test(text);

/**
 * Greeting App definition
 *
 * @typedef {GreetingApp} GreetingApp
 * @property {User} user
 */
class GreetingApp extends DialogflowApp {
  constructor(option) {
    super(option);
  }

  ask(inputPrompt, noInputs, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.prompType = 'text';
    this.data.lastPrompt = inputPrompt;
    super.ask(inputPrompt, noInputs);
  }

  askWithList(inputPrompt, list, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.lastPrompt = inputPrompt;
    this.data.promptype = 'list';
    this.data.lastList = list;
    super.askWithList(inputPrompt, list);
  }

  askWithCarousel(inputPrompt, carousel, isFallback) {
    isFallback = isFallback || false;
    if (!isFallback) {
      this.data.fallbackCount = 0;
    }
    this.data.lastPrompt = inputPrompt;
    this.data.prompType = 'carousel';
    this.data.lastCarousel = carousel;
    super.askWithCarousel(inputPrompt, carousel);
  }

  run() {
    this.user = new User();
    if (this.getUser() === null) {
      const response = this.buildRichResponse();
      const firstResponse = 'Did not receive user data.';
      response.addSimpleResponse(firstResponse);
      this.tell(response);
      return;
    }

    this.user = new User();
    this.user
      .loadById(this.getUser().userId)
      .then(() => {
        console.error('GreetingApp:run > user loaded', {
          user: this.user.getId()
        });
        return this.handleRequestAsync(actions);
      })
      .then(result => {
        console.log('GreetingApp:run > result', result);
      })
      .catch(err => {
        console.error('GreetingApp:run > error', err);
        errorResponse.general(this);
      });
  }

  /**
   * Helper to build SimpleResponse from speech and display text.
   *
   * @param {string|SimpleResponse} response String to speak, or SimpleResponse.
   *     SSML allowed.
   * @param {string} response.speech If using SimpleResponse, speech to be spoken
   *     to user.
   * @param {string=} response.displayText If using SimpleResponse, text to be shown
   *     to user.
   * @return {Object} Appropriate SimpleResponse object.
   */
  buildSimpleResponseHelper(response) {
    if (!response) {
      error('Invalid response');
      return null;
    }
    debug('buildSimpleResponseHelper_: response=%s', JSON.stringify(response));
    let simpleResponseObj = {};
    if (typeof response === 'string') {
      simpleResponseObj =
        isSsml(response) || isPaddedSsml(response)
          ? { ssml: response }
          : { textToSpeech: response };
    } else if (response.speech) {
      simpleResponseObj =
        isSsml(response.speech) || isPaddedSsml(response.speech)
          ? { ssml: response.speech }
          : { textToSpeech: response.speech };
      simpleResponseObj.displayText = response.displayText;
    } else {
      error('SimpleResponse requires a speech parameter.');
      return null;
    }
    return simpleResponseObj;
  }

  isNewUser() {
    return (
      this.body_.originalRequest.data.conversation.type ===
      this.ConversationTypes.NEW
    );
  }

  /**
   * Returns the List constructed in Dialogflow response builder of PAYLOADS.
   *
   * @param {string} command Name of the custom command, if is not present the function will return all payloads.
   *
   * @return {array} Array of Payloads created in Dialogflow, if not payload will return false.
   */
  getIncomingPayloads(command) {
    command = command || null;
    debug('getIncomingPayloads');
    const payloads = [];
    if (
      this.body_.result &&
      this.body_.result.fulfillment &&
      this.body_.result.fulfillment.messages
    ) {
      for (const message of this.body_.result.fulfillment.messages) {
        if (!message.payload) {
          continue;
        }
        if (message.payload instanceof Object) {
          if (command) {
            if (message.payload[command]) {
              return message.payload[command];
            }
          }
          payloads.push(message.payload);
        }
      }
    }
    return payloads.length > 0 ? payloads : false;
  }

  /**
   * Triggers an intent of your choosing by sending a followupEvent from the webhook.
   * This method is not sending `speech`, `displayText` JSON objects
   * as they will be ignored by the system.
   * A context will not be created, so in order to pass the event data
   * you will need to reflect it in the intent created in Dialogflow console.
   * Each variable in the intent should point to another one defined in the event data
   * as stated at https://dialogflow.com/docs/events#sending_parameters_in_a_query_request.
   *
   * @example
   * const app = new DialogflowApp({request: request, response: response});
   * const APPLY_FOR_LICENSE = 'apply-for-license-event';
   * const DATE_TIME = 'dateTime';
   * app.askWithFollowupEvent(APPLY_FOR_LICENSE, {
   *     DATE_TIME: new Date()
   * });
   *
   * @param {string} eventName Name of the event.
   * @param {Object=} eventData Event JSON object.
   * @return {null|undefined} Null if the event name is not string or event data
   * is not a JSON object.
   * @dialogflow
   */
  askWithFollowupEvent(eventName, eventData) {
    debug(
      'askWithFollowupEvent: eventName=%s, eventData=%s',
      eventName,
      JSON.stringify(eventData)
    );
    let isEventNameString = typeof eventName === 'string';
    if (!isEventNameString) {
      this.handleError_('Invalid event name!');
      return null;
    }
    let isEventDataObject = typeof eventData === 'object';
    if (!isEventDataObject) {
      this.handleError_('Invalid event data!');
      return null;
    }
    const response = {
      followupEvent: {
        name: eventName,
        data: eventData
      }
    };
    if (!response) {
      this.handleError_('Error in building response!');
      return null;
    }
    return this.doResponse_(response, RESPONSE_CODE_OK);
  }
}

module.exports = GreetingApp;
