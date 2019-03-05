const http = require('http');
const colors = require('colors');
const routes = require('./routes');
const CONSTANTS = require('./constants');

const server = new http.Server();

server.on('request', routes);

server.listen(CONSTANTS.SETTINGS.PORT, () => {
  console.log(colors.green(CONSTANTS.MESSAGES.SERVER_RUNNING));
});
