const colors = require('colors');
const server = require('./server');
const CONSTANTS = require('./constants');

server.listen(CONSTANTS.SETTINGS.PORT, () => {
  console.log(colors.green(CONSTANTS.MESSAGES.SERVER_RUNNING));
});
