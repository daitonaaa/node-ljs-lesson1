const fs = require('fs');
const mime = require('mime');
const path = require('path');
const stream = require('stream');
const paths = require('../paths');
const CONSTANTS = require('../constants');
const LimitSizeStream = require('./limit-size');


module.exports = {

  send: (filePath, res) => {
    const file = fs.createReadStream(filePath);

    const error = () => {
      res.statusCode = CONSTANTS.ERRORS.FILE_NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.FILE_NOT_FOUND.MESSAGE);
    };

    file
      .on('error', error)
      .pipe(res)
      .on('close', file.destroy);
  },

  getAndSave: function (fileIn, res) {
    const pathname = paths.getPathname(fileIn);

    if (this.isExists(pathname)) {
      res.statusCode = CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.CODE;
      res.end(CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.MESSAGE);
    } else {
      const fileName = pathname.replace('/', '');
      const limitSizeStream = new LimitSizeStream({limit: 1000000});
      const fileOut = fs.createWriteStream(path.join(paths.files, fileName));

      stream.pipeline(fileIn, limitSizeStream, fileOut, (err) => {
        if (err) {
          const isLimitExceeded = err.code === CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE;

          res.statusCode = CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].CODE;
          res.end(CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].MESSAGE);

          this.deleteFile(fileName);
          fileOut.destroy();
          fileIn.destroy();
        } else {
          res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
          res.end(CONSTANTS.RESPONSE.SUCCESS.MESSAGE);
        }
      });
    }
  },

  isExists: (fileName) => {
    const filePath = path.join(paths.files, fileName);

    return fs.existsSync(filePath);
  },

  deleteFile: (fileName, res = null) => {
    const filePath = path.join(paths.files, fileName);

    fs.unlink(filePath, (err) => {
      if (err && err.code === 'ENOENT' && res) {
        res.statusCode = CONSTANTS.ERRORS.FILE_NOT_FOUND.CODE;
        res.end(CONSTANTS.ERRORS.FILE_NOT_FOUND.MESSAGE);
      } else if (err) {
        console.error(err);
      } else if (res) {
        res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
        res.end(CONSTANTS.RESPONSE.SUCCESS.MESSAGE);
      }
    });
  },

  getExtension: (fileName) => {
    fileName = fileName.toLowerCase();
    const v = fileName.split('.');

    return mime.getType(v[v.length - 1]);
  },

  getList: (res) => {
    const files = fs.readdirSync(paths.files);

    res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
    res.end(JSON.stringify(files));
  },
};
