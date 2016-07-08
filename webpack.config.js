/* eslint-disable */

/**
 * Dependencies
 */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

/**
 * Import hash output plugin
 */
var OutputHashAsModulePlugin = require('./webpack-output-hash-as-module-plugin');

/**
 * Environment
 */
var isProduction = process.env.NODE_ENV === 'production';
var port = process.env.PORT || 3000;

/**
 * Plugins
 */
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__DEVELOPMENT__': JSON.stringify(!isProduction)
  }),
  new webpack.IgnorePlugin(new RegExp('node-sass'))
];

/**
 * Add hot module replacement
 * when developing
 */
if (!isProduction) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoErrorsPlugin());
  plugins.push(new webpack.OldWatchingPlugin());
}

/**
 * Do code de-duping and minification
 * when running production mode
 */
if (isProduction) {
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new OutputHashAsModulePlugin({ file: 'bundle-hash.js' }));
	if (!!process.env.DEBUG) {
		plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
  }
}

/**
 * Entry points
 */
var entry = ['./src/client-bootstrap'];

/**
 * Add required entry points
 * when using hot module replacement
 * and webpack-dev-server
 */
if (!isProduction) {
  entry.unshift('webpack/hot/only-dev-server');
  entry.unshift('webpack-dev-server/client?http://localhost:' + port);
}

/**
 * Config
 *
 * TODO: Make the parts of the config that should be
 * customizable properties that you can inject into
 * a constructor function (entry, output.path, output.publicPath, etc...)
 */
module.exports = {
  /**
   * Use source maps for better debugging
   */
  devtool: !isProduction ? 'inline-source-map' : 'source-map',

  /**
   * Add our entry file(s)
   */
  entry: entry,

  /**
   * Bundle output settings
   *
   * Production: Use the hash to tag the output bundles
   * Development: No hashing (as we refer to just "app.js" in /public/static/index.html)
   */
  output: isProduction ? {
    path: './public/static/',
    publicPath: '/static/',
    filename: 'app.[hash].js',
    chunkFilename: '[id].app.[chunkHash].js'
  } : {
    path: './public/static/',
    publicPath: '/static/',
    filename: 'app.js',
    chunkFilename: '[id].app.js'
  },

  /**
   * Add out plugins to the config
   */
  plugins: plugins,

  /**
   * Module loaders for resolving
   * the different file extensions
   * using loaders
   */
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: !isProduction ? ['react-hot', 'babel'] : ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      loader: !isProduction ? 'style!css!postcss!sass' : 'css!postcss!sass'
    }]
  },

  /**
   * Add resolver aliases that
   * we want to ignore in our
   * webpack bundle
   *
   * NOTE: We just replace any
   * server specific modules
   * with a no-op (from npm)
   */
  resolve: {
    alias: {
      'node-sass': 'no-op'
    }
  },

  /**
   * PostCSS options
   */
  postcss: [
    autoprefixer({
      browsers: ['last 3 versions']
    })
  ],

  /**
   * Add node built-ins requires that should
   * be ignored when creating
   * the webpack bundle (since these are server-only)
   */
  node: {
    'fs': 'empty',
    'node-sass': 'empty'
  }
};
