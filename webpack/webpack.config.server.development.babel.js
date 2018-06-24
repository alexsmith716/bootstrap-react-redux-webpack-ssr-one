// import configuration from './webpack.config.server.production.babel';
// import settings from '../configuration';
// 
// export default {
//   ...configuration,
//   output: {
//     ...configuration.output,
//     // Get all statics from webpack development server
//     publicPath: `http://${settings.webpack.devserver.host}:${settings.webpack.devserver.port}${configuration.output.publicPath}`
//   }
// };

const webpack = require('webpack');
const baseConfiguration = require('./webpack.config.server.production.babel');
const settings = require('../configuration');


const configuration = Object.assign({}, baseConfiguration);
const publicPath = configuration.output.publicPath;

configuration.mode = 'development',

// Get all statics from webpack development server
configuration.output.publicPath = `http://${settings.webpack.devserver.host}:${settings.webpack.devserver.port}${configuration.output.publicPath}`;

console.log('>>>>>> webpack.config.server.development.babel.js > configuration.output.publicPath: ', configuration.output.publicPath);


export default configuration;
