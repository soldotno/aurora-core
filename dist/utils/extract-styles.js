'use strict';

/**
 * Dependencies
 */
var debug = require('debug')('aurora-frontend:extract-styles');
var CleanCSS = require('clean-css');
var lru = require('lru-cache');
var md5 = require('md5');

/**
 * Create an instance of the css minifier
 */
var cleanCSS = new CleanCSS();

/**
 * Create a LRU cache that
 * stores a maximum of 500 entries
 */
var cache = lru({ max: 500 });

/**
 * Function for extracting all critical
 * styles from an Aurora config
 */
module.exports = function () {
  var app = arguments.length <= 0 || arguments[0] === undefined ? { options: { modules: [] } } : arguments[0];

  /**
   * Create an initial array to hold all the styles
   */
  var criticalStyles = [];

  /**
   * Create a function that recurses
   * through the entire config to find
   * styles to extract (static getStyles() method on every module)
   */
  function extractStylesRecursively(_ref) {
    var _ref$type$getStyles = _ref.type.getStyles;
    var getStyles = _ref$type$getStyles === undefined ? function () {
      return '';
    } : _ref$type$getStyles;
    var _ref$options$modules = _ref.options.modules;
    var modules = _ref$options$modules === undefined ? [] : _ref$options$modules;

    criticalStyles.push(getStyles());
    modules.forEach(extractStylesRecursively);
  }

  /**
   * Extract all styles from the config / app specification
   */
  extractStylesRecursively(app);

  /**
   * Create a concatenated string of
   * the critical styles that was extracted
   */
  var styles = criticalStyles.join('');

  /**
   * Create a hash of the extracted styles
   * for identification
   */
  var hash = md5(styles);

  /**
   * Add the minified styles to the
   * cache if they don't already exist
   */
  if (!cache.has(hash)) {
    cache.set(hash, cleanCSS.minify(styles).styles);
  }

  /**
   * Log the cache size for each time
   */
  debug('css cache size:', cache.itemCount);

  /**
   * Return the minified styles from the cache
   */
  return cache.get(hash);
};