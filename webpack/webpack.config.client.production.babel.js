const webpack = require('webpack');
const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { clientConfiguration } = require('universal-webpack');
const settings = require('./universal-webpack-settings');
const configuration = require('./webpack.config');
const rootPath = path.resolve(__dirname, '..');

const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const bundleAnalyzerPath = path.resolve(configuration.context, './build/analyzers/bundleAnalyzer');
const visualizerPath = path.resolve(configuration.context, './build/analyzers/visualizer');
const assetsPath = path.resolve(configuration.context, './build/public/assets');
const serverPath = path.resolve(configuration.context, './build/server');

// reuseExistingChunk: allows to reuse existing chunks instead of creating a new one when modules match exactly.
// Chunks can be configured. There are 3 values possible "initial", "async" and "all". 
// When configured the optimization only selects initial chunks, on-demand chunks or all chunks.

configuration.mode = 'production';

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

// configuration.devtool = 'source-map';
// configuration.devtool = 'hidden-source-map';

configuration.stats = {
  // assets: true,
  // cached: true,
  // entrypoints: false,
  // children: false,
}

configuration.entry.main.push(
  'bootstrap-loader',
  './client/index.js',
);

configuration.output.filename = '[name].[chunkhash].bundle.js';
configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';

configuration.module.rules.push(
  {
    test: /\.(scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: true,
          // importLoaders: 2,
          // sourceMap: true,
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          // sourceMap: true,
        }
      },
      {
        loader: 'sass-loader',
        options: {
          // outputStyle: 'expanded',
          // sourceMap: true,
          // sourceMapContents: true
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(configuration.context, 'client/assets/scss/mixins/mixins.scss')
          ],
        },
      },
    ]
  },
  {
    test: /\.(css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader : 'css-loader',
        options: {
          modules: true,
          // importLoaders: 1,
          // sourceMap: true,
        }
      },
      {
        loader : 'postcss-loader'
      },
    ]
  },
);

configuration.optimization = {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '.',
    name: true,
    cacheGroups: {
      // styles: {
      //   name: 'main',
      //   test: (m,c,entry = 'main') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
      //   chunks: 'async',
      //   enforce: true,
      // },
      vendor: {
        name: 'vendor',
        reuseExistingChunk: true,
        chunks: chunk => ['main',].includes(chunk.name),
        test: module => /[\\/]node_modules[\\/]/.test(module.context),
        minChunks: 1,
        minSize: 0,
      },
      // commons: {
      //   name: 'commons',
      // }
    },
  },
  runtimeChunk: {
    name: 'manifest',
  },
  // runtimeChunk: true
  // occurrenceOrder: true,
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PLUGINS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

configuration.plugins.push(

  new CleanWebpackPlugin([bundleAnalyzerPath,visualizerPath,assetsPath,serverPath], { root: configuration.context }),

  // new webpack.IgnorePlugin(/\/iconv-loader$/),
  // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  new MiniCssExtractPlugin({
    // filename: '[name].css',
    filename: '[name].[contenthash].css.css',
    // chunkFilename: '[name].[contenthash].chunk.css',
  }),

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    __DLLS__: false,
  }),

  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    jquery: 'jquery',
    Popper: ['popper.js', 'default'],
    Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
    Button: "exports-loader?Button!bootstrap/js/dist/button",
    Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
    Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
    Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
    Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
    Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
    Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
    Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    Util: "exports-loader?Util!bootstrap/js/dist/util",
  }),

  new ReactLoadablePlugin({
    filename: path.join(configuration.output.path, 'loadable-chunks.json')
  }),

  new UglifyJsPlugin(),
  // new UglifyJsPlugin({
  //   cache: false,      // Enable file caching (default: false)
  //   parallel: false,   // Use multi-process parallel running to improve the build speed (default: false)
  //   sourceMap: false, // Use source maps to map error message locations to modules (default: false)
  //   extractComments: false, // Whether comments shall be extracted to a separate file (default: false)
  //   uglifyOptions: {
  //     ecma: 8, // Supported ECMAScript Version (default undefined)
  //     warnings: false, // Display Warnings (default false)
  //     mangle: true, // Enable Name Mangling (default true)
  //     compress: {
  //       passes: 1,  // The maximum number of times to run compress (default: 1)
  //     },
  //     output: {
  //       beautify: true, // whether to actually beautify the output (default true)
  //       comments: false, // true or "all" to preserve all comments, "some" to preserve some (default false)
  //     },
  //     ie8: false, // Enable IE8 Support (default false)
  //     safari10: false, // Enable work around Safari 10/11 bugs in loop scoping and await (default false)
  //   }
  // }),

  // new OptimizeCSSAssetsPlugin({
  //   cssProcessor: require('cssnano'), // cssnano >>> default optimize \ minimize css processor 
  //   cssProcessorOptions: { discardComments: { removeAll: true } }, // defaults to {}
  //   canPrint: true, // indicating if the plugin can print messages to the console (default true)
  // }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(rootPath, './server/navigateFallback.js'),
  }),

  new SWPrecacheWebpackPlugin({
    cacheId: 'bootstrap-redux-react-loadable-webpack-dllplugin-three',
    filename: 'service-worker.js',
    maximumFileSizeToCacheInBytes: 8388608,

    staticFileGlobs: [path.dirname(configuration.output.path) + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
    // staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
    stripPrefix: path.dirname(configuration.output.path),

    directoryIndex: '/',
    verbose: true,
    navigateFallback: './index.html',
  }),

  new Visualizer({
    filename: '../../analyzers/visualizer/bundle-stats.html'
  }),

  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyzers/bundleAnalyzer/client-development.html',
    // analyzerMode: 'server',
    // analyzerPort: 8888,
    // defaultSizes: 'parsed',
    openAnalyzer: false,
    generateStatsFile: false
  }),
);

// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration: ', configuration)
const configurationClient = clientConfiguration(configuration, settings)
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configurationClient: ', configurationClient)

export default configurationClient;
