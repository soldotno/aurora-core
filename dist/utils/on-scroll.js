'use strict';

/**
 * Helper function for adding
 * a browser resize event listener
 */
module.exports = function (callback) {
  window.addEventListener('scroll', callback);
};