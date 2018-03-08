"use strict";

const expect = require('chai').expect;

describe('Log Handler', function () {
  it('Test a log Handler Message', function () {
    const Log = require('../src/log-controller');
    Log.config.tags.push('DEV');
    Log.error('INFO Message', {user: 234234324, extra: 234234234});
    expect(true).to.equal(true);
  }).timeout(5000);
});
