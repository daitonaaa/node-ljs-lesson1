const path = require('path');
const paths = require('./paths');
const CONSTANTS = require('./constants');
const file = require(paths.modules + '/file');


function routes(req, res) {
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
        if (file.isExists(pathname)) {
          file.send(path.join(paths.files, pathname), res);
        } else {
          res.statusCode = CONSTANTS.ERRORS.NOT_FOUND.CODE;
          res.end(CONSTANTS.ERRORS.NOT_FOUND.MESSAGE);
        }
      }
    }
  }

  // POST
  else if (method === 'POST') {
    // Как можно проверить на наличие поддерикторий в запросе /dir/dir/dir/file.ext
    // без использования костыля !paths.hasSubdectoria(pathname) ?
    if (file.getExtension(req.url) && !paths.hasSubdectoria(pathname)) {
      file.getAndSave(req, res);
    } else {
      res.statusCode = CONSTANTS.ERRORS.NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.NOT_FOUND.MESSAGE)
    }
  }

  // DELETE
  else if (method === 'DELETE') {
    if (file.getExtension(req.url)) {
      file.deleteFile(pathname, res);
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

module.exports = routes;
