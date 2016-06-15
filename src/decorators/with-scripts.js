/**
 * Dependencies
 */
const React = require('react');
const hoistStatics = require('hoist-non-react-statics');

/**
 * Aurora mixins
 */
const ScriptInjectMixin = require('../mixins/script-inject-mixin');

/**
 * Higher order component factory
 * for adding Aurora script injection
 */
module.exports = function({ scripts }) {
  return function(Component) {
    const withScripts = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withScripts',

      /**
       * Mixins
       */
      mixins: [
        ScriptInjectMixin(scripts),
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
    return hoistStatics(withScripts, Component);
  };
};
