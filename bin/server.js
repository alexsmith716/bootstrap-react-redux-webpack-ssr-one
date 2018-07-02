
// enable ES6 and ES7

require('../server.babel');

const path = require('path');
const rootDir = path.resolve(__dirname, '..');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

// initiates 'server.js'
require('../server/index');
