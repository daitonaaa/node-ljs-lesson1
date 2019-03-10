const assert = require('assert');
const paths = require('../paths');
const CONSTANTS = require('../constants');
const LimitSizeStream = require(paths.modules + '/LimitSizeStream');

describe('LimitSizeStream', () => {

  it('throws limit size stream', (done) => {
    const stream = new LimitSizeStream({limit: 2});

    stream.on('error', (err) => {
      assert.strictEqual(err.code, CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE);

      done();
    });

    stream.write('abc');
  });

});
