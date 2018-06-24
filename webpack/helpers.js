var path = require('path');
var fs = require('fs');
var projectRootPath = path.resolve(__dirname, '../');
var webpack = require('webpack');

module.exports = {
  isValidDLLs: isValidDLLs,
  installVendorDLL: installVendorDLL,
};

function installVendorDLL(config, dllName) {
  var manifest = loadDLLManifest(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
  // console.log('>>>>>>>>>>>> HELPERS > installVendorDLL > manifest: ', manifest);

  if (manifest) {
    console.log(`>>>>>>>>>>>> HELPERS > installVendorDLL > Webpack: will be using the ${dllName} DLL <<<<<<<`);
    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest: manifest
    }));
  } else {
    console.log('>>>>>>>>>>>> HELPERS > installVendorDLL > NO manifest <<<<<<<');
  }
};

function loadDLLManifest(filePath) {
  try {
    return require(filePath);
  }
  catch (e) {
    process.env.WEBPACK_DLLS = '0';

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the DLLs.
You can do that by running:
    yarn build-dlls
The request to use DLLs for this build will be ignored.`);
  }

  return undefined;
}


function isValidDLLs(dllNames, assetsPath) {

  for (var dllName of [].concat(dllNames)) {

    try {

      var manifest = require(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
      var dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`)).toString('utf-8');

      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`>>>>>>>>>>>> HELPERS > isValidDLLs > Invalid dll: ${dllName}`);
        return false;
      }

    } catch (e) {

      return false;
    }
  }

  return true;
}

