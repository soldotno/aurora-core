'use strict';

/**
 * Dependencies
 */
var React = require('react');
var hoistStatics = require('hoist-non-react-statics');

/**
 * Aurora mixins
 */
var ScriptInjectMixin = require('../mixins/script-inject-mixin');

/**
 * Higher order component factory
 * for adding Aurora script injection
 */
module.exports = function (_ref) {
  var scripts = _ref.scripts;

  return function (Component) {
    var withScripts = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withScripts',

      /**
       * Mixins
       */
      mixins: [ScriptInjectMixin(scripts)],

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
    return hoistStatics(withScripts, Component);
  };
};