/**
 * Import the existing webpack config
 */
var webpackConfigDefault = require('./webpack.config.js');

/**
 * Create a function that returns a Karma config function
 * where we can choose to pass a custom webpack config to be used
 */
var configureKarma = function(webpackConfig) {
  /**
   * Default if a webpack config was not passed
   */
  var webpackConfig = webpackConfig || webpackConfigDefault;

  /**
   * Return the Karma config function
   */
  return function (config) {
    config.set({
      /**
       * Run tests in Chrome and Firefox
       */
      browsers: ['Chromium'],

      /**
       * Just run once by default
       */
      singleRun: true,

      /**
       * Use the mocha test framework
       */
      frameworks: ['mocha'],

      /**
       * Just load this file (contains a reference to all the tests)
       */
      files: [
        './karma.tests.js'
      ],

      /**
       * Preprocess with webpack and our sourcemap loader
       */
      preprocessors: {
        './karma.tests.js': ['webpack', 'sourcemap']
      },

      /**
       * Report results in this format
       */
      reporters: ['mocha'],

      /**
       * Kind of a copy of your webpack config
       */
      webpack: {
        devtool: 'inline-source-map',

        module: {
          loaders: webpackConfig.module.loaders
        },

        resolve: {
          alias: webpackConfig.resolve.alias
        },

        node: webpackConfig.node
      },

      /**
       * Please don't spam the console when running in karma!
       */
      webpackServer: {
        noInfo: true
      }
    });
  };
};

/**
 * Export the regular Karma config
 */
module.exports = configureKarma();

/**
 * Export an extendable version of the Karma config
 */
module.exports.extend = configureKarma;
