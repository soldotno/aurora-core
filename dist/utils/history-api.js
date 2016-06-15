'use strict';

/**
 * Set scroll handling to manual
 */
if ('scrollRestoration' in history) {
  // Back off, browser, I got this...
  history.scrollRestoration = 'manual';
}

/**
 * Export a history API shim
 */
module.exports = window.history || {
  pushState: function pushState() {},
  replaceState: function replaceState() {},

  state: undefined
};