"use strict";

const assert = require('assert');

describe('String Controller', function () {
  it('Test how to process the strings', function () {
    const utils = require('../src/utils/utils');
    const strings = require('../src/entrypoints/dialogflow/constants').strings;
    let var1 = utils.randomString(strings.welcome.welcome);
    let var2 = utils.randomString(strings.error.general);
    assert.notEqual(var1.length, 0);
    assert.notEqual(var2.length, 0);
  }).timeout(5000);
});
