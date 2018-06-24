const sass = require('node-sass');
const path = require('path');

console.log('>>>>>>>>>>>>>>>>>>>>>>>>> sassLoader.js <<<<<<<<<<<<<<<<<<<<<<<<');

module.exports = (data, file) => {

  try {
    return sass.renderSync({data, file}).css.toString('utf8');
  } catch (e) {
    console.error(e);
  }

};


// module.exports = function processSass(data, filename) {
//   var result;
//   result = sass.renderSync({
//     data: data,
//     file: filename
//   }).css;
//   return result.toString('utf8');
// };