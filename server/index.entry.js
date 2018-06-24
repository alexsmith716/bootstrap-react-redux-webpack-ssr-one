// require('../server.babel');
// enable runtime transpilation to use ES6/7 in node
// babel registration (runtime transpilation for node)
// target 

// require('babel-register');
// enable runtime transpilation to use ES6/7 in node
// babel registration (runtime transpilation for node)

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

console.log('>>>>>>>>>>>>>>> SERVER > INDEX.ENTRY.JS > global.__DLLS__ >>>>>>>>>>>>>>>>>>>>: ', global.__DLLS__);

// require('babel-register')({
//   plugins: [
//     ['css-modules-transform', {
//       preprocessCss: '../loaders/sassLoader.js',
//       generateScopedName: '[name]__[local]__[hash:base64:5]',
//       extensions: ['.css', '.scss'],
//     }],
//   ],
// });


// Babel ES6 polyfill
require('babel-polyfill')

require('./index');

// Babel refresher !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// https://babeljs.io/docs/setup/
// https://babeljs.io/docs/usage/babelrc/
// https://github.com/babel/babel-loader
// 
// Choose Your Tool
// ---------------------------------------------------------------------------------------------------------------
// 
// Babel built-in:
// 
//   * (CLI) > (babel-cli --dev) :
//     - Run Babel from commands in npm scripts ( "scripts": { "build": "babel src -d lib" } )
// 
//   * (Require hook) > (require('babel-register')) : 
//     - All subsequent files required by node with the extensions .es6, .es, .jsx and .js will be transformed by Babel. 
//     - The polyfill specified in polyfill is also automatically required.
// 
// Build systems:
//   * Webpack > (babel-loader babel-core) :
//     - Babel is configured but not doing anything. 
//     - Create a .babelrc config in your project root and enable some plugins.
//     - To start, you can use the env preset, which enables transforms for ES2015+
// 
// 
// How to use the .babelrc:
// 
//   * Use via package.json :
//     - "babel": { // my babel config here }
// 
//   * env option
//     - You can use the env option to set specific options when in a certain environment:
//     - "env": { "production": {"plugins": ["transform-react-constant-elements"] } }
//     - Options specific to a certain environment are merged into and overwrite non-env specific options.
//     - The env key will be taken from process.env.BABEL_ENV,
//     - when this is not available then it uses process.env.NODE_ENV
//     - if even that is not available then it defaults to "development".
// 
// Babel Lookup behavior:
// 
//   * Babel will look for a .babelrc in the current directory of the file being transpiled. 
//     If one does not exist, it will travel up the directory tree until it finds either a .babelrc, 
//     or a package.json with a "babel": {} hash within.
// 
//   * Use "babelrc": false in options to stop lookup behavior, or provide the --no-babelrc CLI flag.
