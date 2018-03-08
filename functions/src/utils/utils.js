'use strict';

const JSONbig = require('json-bigint');
const Log = require('../log-controller');

class Utils {
  static getJsonObject(data) {
    if (typeof data === 'string') {
      try {
        data = JSONbig.parse(data);
      } catch (error) {
        Log.error('Utils: getJsonObject catch', { reason: error });
      }
    }

    return data;
  }

  static mergeData(baseData, insertData) {
    let result = baseData;

    if (baseData !== undefined && insertData !== undefined) {
      if (Array.isArray(insertData)) {
        insertData = insertData.reduce(function(acc, cur, i) {
          acc[i] = cur;
          return acc;
        }, {});
      }

      result = Object.assign(baseData, insertData);
    }

    return result;
  }
  /**
   * @param {Response<T>} response Assistant app response object.
   * @param {String|String[]} message The message to show or array of string messages. Gets picked at random.
   */
  static addSimpleResponse(response, message) {
    if (Array.isArray(message)) {
      response.addSimpleResponse(
        message[Math.floor(message.length * Math.random())]
      );
    }
    return response.addSimpleResponse(message);
  }

  static unicodeEscape(str) {
    return str.replace(/[\u007f-\uffff]/g, function(c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
  }

  /**
   * @param {Array<T>} array The array to get a random value from
   */
  static getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   *
   * @param {Array<string>} stringArray
   */
  static randomString(stringArray) {
    if (!stringArray.length) {
      return null;
    }
    return Utils.getRandomValue(stringArray);
  }
}

module.exports = Utils;
