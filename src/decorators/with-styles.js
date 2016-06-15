/**
 * Dependencies
 */
const React = require('react');
const sassLoader = require('aurora-sass-loader');
const hoistStatics = require('hoist-non-react-statics');

/**
 * Aurora mixins
 */
const StyleInjectMixin = require('../mixins/style-inject-mixin');

/**
 * Export a decorator that
 * handles style injection and extraction
 * in the Aurora frontend
 */
module.exports = function({ serverPath, clientStyles }) {
  /**
   * Load the styles for server rendering with the Aurora Sass loader
   */
  const serverStyles = sassLoader(serverPath);

  /**
   * Return a function that produces a higher
   * order component that includes styling
   */
  return function(Component) {
    const withStyles = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withStyles',

      /**
       * Add static methods needed
       */
      statics: {
        getStyles() {
          return serverStyles;
        },
      },

      /**
       * Mixins
       */
      mixins: [
        StyleInjectMixin(clientStyles),
      ],

      /**
       * Render the component
       */
      render() {
        return (
          <Component {...this.props} />
        );
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
