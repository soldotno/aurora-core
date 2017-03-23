'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _auroraSassLoader = require('aurora-sass-loader');

var _auroraSassLoader2 = _interopRequireDefault(_auroraSassLoader);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _styleInjectMixin = require('../mixins/style-inject-mixin');

var _styleInjectMixin2 = _interopRequireDefault(_styleInjectMixin);

var _getDisplayName = require('../utils/get-display-name');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export a decorator that handles style injection and extraction in the Aurora frontend


// Aurora mixins
module.exports = function (_ref) {
  var serverPath = _ref.serverPath,
      clientStyles = _ref.clientStyles;

  ///Load the styles for server rendering with the Aurora Sass loader
  var serverStyles = (0, _auroraSassLoader2.default)(serverPath);

  // Return a function that produces a higher order component that includes styling
  return function (Component) {
    var withStyles = _react2.default.createClass({
      // Add a specific display name
      displayName: (0, _getDisplayName2.default)(Component) + 'WithStyles',

      // Add static methods needed
      statics: {
        getStyles: function getStyles() {
          return serverStyles;
        }
      },

      // Mixins
      mixins: [(0, _styleInjectMixin2.default)(clientStyles)],

      // Render the component
      render: function render() {
        return _react2.default.createElement(Component, this.props);
      }
    });

    // Return a decorated component with all the existing static methods hoisted
    return (0, _hoistNonReactStatics2.default)(withStyles, Component);
  };
}; // Dependencies