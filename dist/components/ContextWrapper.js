'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Dependencies
 */
var React = require('react');

/**
 * Aurora module React component
 */
var ContextWrapper = React.createClass({
  displayName: 'ContextWrapper',

  /**
   * Declare the proptypes we accept
   */
  propTypes: {
    actions: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },

  /**
   * Declare the context types we accept being set
   */
  childContextTypes: {
    actions: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired
  },

  /**
   * Set the context using props
   */
  getChildContext: function getChildContext() {
    var _props = this.props,
        children = _props.children,
        props = _objectWithoutProperties(_props, ['children']);

    return _extends({}, props);
  },


  /**
   * Render the children (which in our case will be the App)
   */
  render: function render() {
    var children = this.props.children;

    return children;
  }
});

/**
 * Export component
 */
module.exports = ContextWrapper;