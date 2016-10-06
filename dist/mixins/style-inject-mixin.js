'use strict';

/* global __DEVELOPMENT__ */

/**
 * Dependencies
 */
var isBrowser = require('is-client')();
var injectStyles = require('style-loader/addStyles');

/**
 * Export a mixin that handles
 * the injection of styles in an Aurora module
 */
module.exports = function (clientStyles) {
  return {
    /**
     * This is the code used for
     * dynamically injection styles
     * when the page is loaded on
     * the client
     *
     * We also want to avoid doing
     * this in development since
     * we want hot loading (thus doing this another way)
     */

    componentWillMount: function componentWillMount() {
      if (isBrowser && !__DEVELOPMENT__) {
        injectStyles(clientStyles);
      }
    }
  };
};