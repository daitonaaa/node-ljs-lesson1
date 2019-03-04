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
    }
  }

};

module.exports = CONSTANTS;
