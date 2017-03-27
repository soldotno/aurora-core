'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _scriptInjectMixin = require('../mixins/script-inject-mixin');

var _scriptInjectMixin2 = _interopRequireDefault(_scriptInjectMixin);

var _getDisplayName = require('../utils/get-display-name');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Higher order component factory for adding Aurora script injection


// Aurora mixins
// Dependencies
module.exports = function (_ref) {
  var scripts = _ref.scripts;

  return function (Component) {
    var withScripts = _react2.default.createClass({
      // Add a specific display name
      displayName: (0, _getDisplayName2.default)(Component) + 'WithScripts',

      // Mixins
      mixins: [(0, _scriptInjectMixin2.default)(scripts)],

      // Render the component
      render: function render() {
        return _react2.default.createElement(Component, this.props);
      }
    });

    // Return a decorated component with all the existing static methods hoisted
    return (0, _hoistNonReactStatics2.default)(withScripts, Component);
  };
};