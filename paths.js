const url = require('url');
const path = require('path');

module.exports = {
  files: path.join(__dirname, 'files'),
  public: path.join(__dirname, 'public'),
  modules: path.join(__dirname, 'modules'),

  getPathname: (req) => decodeURI(url.parse(req.url).pathname),
  hasSubdectoria: (path) => path.split('/').length > 2,
};
