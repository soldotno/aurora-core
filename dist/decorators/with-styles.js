'use strict';

/**
 * Dependencies
 */
var React = require('react');
var sassLoader = require('aurora-sass-loader');
var hoistStatics = require('hoist-non-react-statics');

/**
 * Aurora mixins
 */
var StyleInjectMixin = require('../mixins/style-inject-mixin');

/**
 * Export a decorator that
 * handles style injection and extraction
 * in the Aurora frontend
 */
module.exports = function (_ref) {
  var serverPath = _ref.serverPath,
      clientStyles = _ref.clientStyles;

  /**
   * Load the styles for server rendering with the Aurora Sass loader
   */
  var serverStyles = sassLoader(serverPath);

  /**
   * Return a function that produces a higher
   * order component that includes styling
   */
  return function (Component) {
    var withStyles = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withStyles',

      /**
       * Add static methods needed
       */
      statics: {
        getStyles: function getStyles() {
          return serverStyles;
        }
      },

      /**
       * Mixins
       */
      mixins: [StyleInjectMixin(clientStyles)],

      /**
       * Render the component
       */
      render: function render() {
        return React.createElement(Component, this.props);
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return hoistStatics(withStyles, Component);
  };
};