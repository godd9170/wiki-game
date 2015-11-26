var webpack = require('webpack');
var path = require('path');
var pwd = path.resolve(__dirname);

//
// Handling and defining environments
//

// a list of environments which are considered 'production'
// for the purpose of building the JS bundle
var IS_PROD = false;

// whether or not we should do the hot load configuration
var HOT_LOAD = JSON.parse(process.env.HOT_LOAD || 'false');
if (HOT_LOAD) {
  console.warn(
    "WARNING: Hot module replacement will be enabled. " +
    "This should ONLY be used for local development.\n"
  );
}

//
// Configuring webpack plugins
//
//

var plugins = [];

//
// conditional on environment plugins
//

if (IS_PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

if (HOT_LOAD) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.ProgressPlugin(function(percentage, message) {
    process.stdout.write('.');
    if (percentage === 1) {
      process.stdout.write('\n\n');
    }
  }));
}


//
// Entry points (conditionally hot reloaded)
//
//

var baseEntry = {
  'app': './src/app.jsx',
}

var hotLoadEntry = {};
// converts each entry point to an array ['entryPoint', 'webpack/hot...']
Object.keys(baseEntry).forEach(function(key) {
  var entryPoint = baseEntry[key];
  hotLoadEntry[key] = ['webpack-dev-server/client?http://0.0.0.0:3000', 'webpack/hot/dev-server', entryPoint];
});

var entry = HOT_LOAD ? hotLoadEntry : baseEntry;

//
// Preloaders
//
//

var preLoaders = [];

if (/*ENV === 'local'*/ false) { // we are not ready for ESLint
  preLoaders.push({
    test: /\.jsx?$/, exclude: /node_modules/, loader: 'eslint-loader'
  });
}

//
// Loaders
//
//

var loaders = [
  { test: /\.css$/, loader:
    'style!' + (IS_PROD ? 'css' : 'css?localIdentName=[name]--[local]--[hash:base64:5]') + '!autoprefixer'
  },
  { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
  { test: /\.scss$/, loader: 'style!css!autoprefixer!sass' },
  { test: /\.json$/, loader: 'json-loader' }
];

if (HOT_LOAD) {
  loaders.forEach(function(loaderConfig) {
    // prepend each loader string with 'react-hot!'
    loaderConfig.loader = 'react-hot!' + loaderConfig.loader;
  });
}


//
// The actual webpack config object follows
//
//

module.exports = {
  entry: entry,
  devtool: IS_PROD ? 'cheap-source-map' : 'eval',
  output: {
    path: pwd + '/src/assets/js',
    filename: '[name].entry.js',
    publicPath: HOT_LOAD ? 'http://0.0.0.0:3000/src/assets/js' : undefined,
  },
  module: {
    preLoaders: preLoaders,
    loaders: loaders,
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  resolve: {
    alias: {
      app: pwd + '/src'
    },
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: plugins
};
