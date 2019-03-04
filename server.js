const http = require('http');
const colors = require('colors');
const CONSTANTS = require('./constants');
const routesConfig = require('./routesConfig');

const server = new http.Server();

server.on('request', routesConfig);

server.listen(CONSTANTS.SETTINGS.PORT, () => {
  console.log(colors.green(CONSTANTS.MESSAGES.SERVER_RUNNING));
});
