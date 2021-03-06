const fs = require('fs');
const mime = require('mime');
const path = require('path');
const stream = require('stream');
const paths = require('../paths');
const CONSTANTS = require('../constants');
const LimitSizeStream = require('./LimitSizeStream');


module.exports = {

  send: function (filePath, res) {
    const file = fs.createReadStream(filePath);

    const error = () => {
      res.statusCode = CONSTANTS.ERRORS.FILE_NOT_FOUND.CODE;
      res.end(CONSTANTS.ERRORS.FILE_NOT_FOUND.MESSAGE);
    };

    res.setHeader('Content-Type', this.getExtension(filePath));

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
      const fileName = pathname.replace('/', '');
      const limitSizeStream = new LimitSizeStream({limit: 1000000});
      const fileOut = fs.createWriteStream(path.join(paths.files, fileName));

      const cleanup = () => {
        fileOut.destroy();
        limitSizeStream.destroy();
      };

      req
        .on('error', cleanup)
        .pipe(limitSizeStream)
        .pipe(fileOut)
        .on('error', cleanup);

      limitSizeStream.on('error', (err) => {
        const isLimitExceeded = err.code === CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE;

        cleanup();
        this.deleteFile(fileName);
        res.statusCode = CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].CODE;
        res.end(CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].MESSAGE);
      });

      fileOut.on('finish', () => {
        res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
        res.end(CONSTANTS.RESPONSE.SUCCESS.MESSAGE);
      });

      // stream.pipeline(req, limitSizeStream, fileOut, (err) => {
      //   if (err) {
      //     const isLimitExceeded = err.code === CONSTANTS.ERRORS.LIMIT_EXCEEDED.CODE;
      //
      //     res.statusCode = CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].CODE;
      //     res.end(CONSTANTS.ERRORS[isLimitExceeded ? 'LIMIT_EXCEEDED' : 'SERVER_ERROR'].MESSAGE);
      //
      //     this.deleteFile(fileName);
      //     fileOut.destroy();
      //     req.destroy();
      //   } else {
      //     res.statusCode = CONSTANTS.RESPONSE.SUCCESS.CODE;
      //     res.end(CONSTANTS.RESPONSE.SUCCESS.MESSAGE);
      //   }
      // });
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
