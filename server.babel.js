
require('babel-polyfill');

var fs = require('fs');
var babelrc = fs.readFileSync('./.babelrc');
var config;

try {

  console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > 1111111111111: ', babelrc);


  config = JSON.parse(babelrc);

  console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > 222222222222222: ', config);

  if (Array.isArray(config.plugins)) {
    config.plugins.push('dynamic-import-node');
  }
} catch (err) {
  console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > ERROR parsing .babelrc: ', err);
}
require('babel-register')(config);