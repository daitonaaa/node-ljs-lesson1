const path = require('path');
const paths = require('./paths');
const CONSTANTS = require('./constants');
const file = require(paths.modules + '/file');


function routesConfig(req, res) {
  const method = req.method;
  const pathname = paths.getPathname(req);

  // GET
  if (method === 'GET') {
    switch (pathname) {
      case '/':
        file.send(paths.public + '/index.html', res);
        break;

      case '/list':
        file.getList(res);
        break;

      default: {
        if (file.isExists(path.join(paths.files, pathname))) {
          file.send(path.join(paths.files, pathname), res);
        } else {
          res.statusCode = CONSTANTS.ERRORS.NOT_FOUND.CODE;
          res.end(CONSTANTS.ERRORS.NOT_FOUND.MESSAGE)
        }
      }
    }
  }

  // POST
  else if (method === 'POST') {
    if (file.getExtension(req.url)) {
      file.getAndSave(req, res);
    } else {
      res.statusCode = CONSTANTS.ERRORS.NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.NOT_FOUND.MESSAGE)
    }
  }

  // OTHERS
  else {
    res.statusCode = CONSTANTS.ERRORS.NOT_FOUND.CODE;
    res.end(CONSTANTS.ERRORS.NOT_FOUND.MESSAGE);
  }
}

module.exports = routesConfig;
