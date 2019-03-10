const stream = require('stream');
const CONSTANTS = require('../constants');


class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.size = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.size += chunk.length;

    if (this.size > this.limit) {
      const error = new Error();
      error.code = CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE;
      callback(error, chunk)
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
