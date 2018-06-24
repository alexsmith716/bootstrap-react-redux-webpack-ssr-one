// var autoprefixer = require('autoprefixer')
// var cssCustomProperties = require('postcss-custom-properties')
// var postcssCalc = require('postcss-calc')
// 
// module.exports = {
//   plugins: [
//     autoprefixer(),
//     cssCustomProperties(),
//     postcssCalc()
//   ]
// }

// http://cssnext.io/features/

module.exports = {
  use: [
    'postcss-import',
    'postcss-url',
    'postcss-preset-env',
    'postcss-browser-reporter',
    'postcss-reporter',
  ]
};


// https://github.com/postcss/postcss-loader#context-ctx


// module.exports = ({ file }) => ({
//   plugins: {
//     'postcss-import': { root: file.dirname },
//     'postcss-url': [
//       { filter: './**.*', url: asset => `./${asset.url}` }, // [relative path]
//     ],
//     // http://cssnext.io/usage, http://browserl.ist
//     'postcss-cssnext': {
//       browsers: ['last 2 version'],
//     },
//     // add your "plugins" here
//     // ...
//     // and if you want to compress,
//     // just use css-loader option that already use cssnano under the hood
//     'postcss-browser-reporter': {},
//     'postcss-reporter': {},
//   }
// });