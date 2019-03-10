const fs = require('fs');
const axios = require('axios');
const assert = require('assert');
const paths = require('../paths');
const server = require('../server');
const CONSTANTS = require('../constants');

const requestUrl = `http://localhost:${CONSTANTS.SETTINGS.PORT}`;


describe('server', () => {

  before('run server', (done) => {
    server.listen(CONSTANTS.SETTINGS.PORT, done);
  });

  after('terminate server', (done) => {
    server.close(done);
  });

  describe('get', () => {
    it('returns index.html when request /', async () => {
      const response = await axios.get(requestUrl);
      const content = fs.readFileSync(paths.public + '/index.html', {encoding: 'utf-8'});

      assert.strictEqual(response.data, content);
      assert.strictEqual(response.headers['content-type'], 'text/html');
    })
  });

  describe('post', () => {
    // it('post file to server', async (done) => {
    //   const fileName = '/file.txt';
    //   const fileIn = fs.createReadStream(paths.assets + fileName);
    //
    //   const req = await axios.post(requestUrl + fileName);
    //
    //   fileIn
    //     .pipe(req)
    //     .on('error', (err) => {
    //       console.log(err.code)
    //     });
    //
    //   done();
    // });
  });

  describe('delete', () => {});
});
