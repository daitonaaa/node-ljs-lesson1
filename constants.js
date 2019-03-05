const CONSTANTS = {

  SETTINGS: {
    PORT: 8081,
  },

  MESSAGES: {
    SERVER_RUNNING: 'Server is running on 8081 port',
  },

  ERRORS: {
    NOT_FOUND: {
      CODE: 500,
      MESSAGE: 'Not found',
    },
    FILE_NOT_FOUND: {
      CODE: 404,
      MESSAGE: 'File not found',
    },
    FILE_ALREADY_EXISTS:  {
      CODE: 409,
      MESSAGE: 'File already exists',
    },
    LIMIT_EXCEEDED: {
      CODE: 429,
      MESSAGE: 'LIMIT_EXCEEDED',
    },
    SERVER_ERROR: {
      CODE: 480,
      MESSAGE: 'Server error',
    }
  },

  RESPONSE: {
    SUCCESS: {
      CODE: 200,
      MESSAGE: 'OK',
    },
  },

};

module.exports = CONSTANTS;
