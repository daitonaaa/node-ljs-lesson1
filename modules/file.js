const fs = require('fs');
const mime = require('mime');
const path = require('path');
const paths = require('../paths');
const CONSTANTS = require('../constants');


module.exports = {

  send: (filePath, res) => {
    const file = fs.createReadStream(filePath);

    const error = (err) => {
      res.statusCode = CONSTANTS.ERRORS.FILE_NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.FILE_NOT_FOUND.MESSAGE);
      console.error(err);
    };

    file
      .pipe(res)
      .on('error', error);

    res.on('close', file.destroy);
  },

  getAndSave: function (req, res) {
    const pathname = paths.getPathname(req);

    if (this.isExists(path.join(paths.files, pathname))) {
      res.statusCode = CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.CODE;
      res.end(CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.MESSAGE);
    } else {

      res.end('Зашёл')
    }
  },

  isExists: (filePath) => fs.existsSync(filePath),

  getExtension: (fileName) => {
    fileName = fileName.toLowerCase();
    const v = fileName.split('.');

    return mime.getType(v[v.length - 1]);
  },

  getList: (res) => {
    const files = fs.readdirSync(paths.files);

    res.statusCode = 200;
    res.end(JSON.stringify(files));
  },
};
