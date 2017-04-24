const PropTypes = require('prop-types');
/**
 * Dependencies
 */
const React = require('react');
const isBrowser = require('is-client')();

/**
 * Export a mixin that handles
 * the injection of external scripts
 * in an Aurora module
 */
module.exports = function (injectScripts) {
  return {
    /**
     * Pull out the settings from context
     */
    contextTypes: {
      actions: PropTypes.object,
      settings: PropTypes.object,
      experiments: PropTypes.object,
    },

    /**
     * This is the code used for
     * dynamically injection scripts
     * when the page is loaded on
     * the client
     */
    componentWillMount() {
      if (isBrowser) {
        injectScripts(this.context);
      }
    },
  };
};
