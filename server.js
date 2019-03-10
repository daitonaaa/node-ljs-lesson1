const http = require('http');
const routes = require('./routes');


const server = new http.Server();

server.on('request', routes);

module.exports = server;
