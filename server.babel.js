
require('babel-polyfill');

const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');
const config;


try {

  config = JSON.parse(babelrc);

  if (Array.isArray(config.plugins)) {

    config.plugins.push('dynamic-import-node');

  }

} catch (err) {

  console.log('>>>>>>>>>>>>>>>> SERVER.BABEL > ERROR parsing .babelrc: ', err);

}

require('babel-register')(config);


//   * (Require hook) > (require('babel-register')) : 
//     - All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel. 
//     - The polyfill specified in polyfill is also automatically required.

// Babel Lookup behavior:
// 
//   * Babel will look for a .babelrc in the current directory of the file being transpiled. 
//     If one does not exist, it will travel up the directory tree until it finds either a .babelrc, 
//     or a package.json with a "babel": {} hash within.
// 
//   * Use "babelrc": false in options to stop lookup behavior, or provide the --no-babelrc CLI flag.