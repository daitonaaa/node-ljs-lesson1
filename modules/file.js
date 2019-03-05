const fs = require('fs');
const mime = require('mime');
const path = require('path');
const paths = require('../paths');
const CONSTANTS = require('../constants');
const LimitSizeStream = require('./limit-size');


module.exports = {

  send: (filePath, res) => {
    const file = fs.createReadStream(filePath);

    const error = (err) => {
      res.statusCode = CONSTANTS.ERRORS.FILE_NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.FILE_NOT_FOUND.MESSAGE);
      console.error(err);
    };

    file
      .on('error', error)
      .pipe(res)
      .on('close', file.destroy);
  },

  getAndSave: function (req, res) {
    const pathname = paths.getPathname(req);

    if (this.isExists(pathname)) {
      res.statusCode = CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.CODE;
      res.end(CONSTANTS.ERRORS.FILE_ALREADY_EXISTS.MESSAGE);
    } else {
      const fileName = paths.getPathname(req).replace('/', '');
      const limitSizeStream = new LimitSizeStream({limit: 1000});
      // const limitSizeStream = new LimitSizeStream({limit: 1000000});
      const fileOut = fs.createWriteStream(
        path.join(paths.files, fileName)
      );

      const cleanup = () => {
        req.destroy();
        fileOut.destroy();
        // res end
      }

      req
        .on('error', cleanup)
        .pipe(limitSizeStream)
        .pipe(fileOut)
        .on('error', cleanup);

      limitSizeStream.on('error', (error) => {
        if (error.code === CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE) {
          res.end(CONSTANTS.ERRORS.LIMIT_EXCEEDED.MESSAGE);
          res.statusCode = CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE;
        } else {
          console.error(error);
        }
      });

      fileOut.on('finish', () => {
        res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
        res.end(CONSTANTS.RESPONSE.SUCCESS.MESSAGE);
      })
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
