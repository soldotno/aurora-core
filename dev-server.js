/**
 * Dependencies
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

/**
 * Import our webpack configuration
 */
var webpackConfigDefault = require('./webpack.config');

/**
 * Export a constructor function for the webpack dev-server instance
 */
module.exports = function(options) {
  /**
   * Add defaults for input options
   */
  var webpackConfig = options.webpackConfig || webpackConfigDefault;
  var port = options.port || 3000;
  var onListen = options.onListen || function () { console.log('development server started') };

  /**
   * When we run in development mode
   * we use a webpack-dev-server
   * and run only client side
   */
  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: webpackConfig.output.path,
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }).listen(port, 'localhost', onListen);
}
