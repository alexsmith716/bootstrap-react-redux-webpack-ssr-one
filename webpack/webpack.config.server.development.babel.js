const webpack = require('webpack');
const baseConfiguration = require('./webpack.config.server.production.babel');
const settings = require('../configuration');

const dev_config = require('../config/config');

const configuration = Object.assign({}, baseConfiguration);
const publicPath = configuration.output.publicPath;

configuration.mode = 'development',

// Get all statics from webpack development server
configuration.output.publicPath = `http://${dev_config.devServerHost}:${dev_config.devServerPort}${configuration.output.publicPath}`;

console.log('>>>>>> webpack.config.server.development.babel.js > configuration.output.publicPath: ', configuration.output.publicPath);


export default configuration;
