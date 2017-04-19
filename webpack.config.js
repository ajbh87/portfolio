var path = require('path');

module.exports = {
  entry: './scripts/script.js',
  output: {
    filename: 'script-bundle.js',
    path: path.resolve(__dirname)
  },
  module: {
    noParse: /DrawSVGPlugin/
  },
  watch: true
};
