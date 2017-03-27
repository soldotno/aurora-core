'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _sortedObject = require('sorted-object');

var _sortedObject2 = _interopRequireDefault(_sortedObject);

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

var _getDisplayName = require('../utils/get-display-name');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export a decorator that handles conditional visibility in the Aurora frontend
module.exports = function (Component) {
  var withVisibility = _react2.default.createClass({
    // Add a specific display name
    displayName: (0, _getDisplayName2.default)(Component) + 'WithVisibility',

    // Our component will make use of some internal props, which we prefix with _
    // This signals that they should be left alone by anything else
    propTypes: {
      _hideOnServer: _react2.default.PropTypes.bool,
      _hideOnClient: _react2.default.PropTypes.bool
    },

    // Set appropriate defaults
    getDefaultProps: function getDefaultProps() {
      return {
        _hideOnServer: true,
        _hideOnClient: false
      };
    },


    // Set the initial state of visibility to what we got from the server config
    // All modules that have a visibility flag in the config will have 'hideOnServer' = false
    getInitialState: function getInitialState() {
      return {
        isVisible: !this.props._hideOnServer
      };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
      // const nextPropsAdjusted =  serialize(sortedObject(nextProps));
      // const thisPropsAdjusted = serialize(sortedObject(this.props));
      var nextStateAdjusted = (0, _serializeJavascript2.default)((0, _sortedObject2.default)(nextState));
      var thisStateAdjusted = (0, _serializeJavascript2.default)((0, _sortedObject2.default)(this.state));
      return !(nextStateAdjusted === thisStateAdjusted && (0, _serializeJavascript2.default)((0, _sortedObject2.default)(nextProps)) === (0, _serializeJavascript2.default)((0, _sortedObject2.default)(this.props)));
    },


    // Handle updates with new props
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.setState({
        isVisible: !nextProps._hideOnClient
      });
    },


    // A method for handling the visibility on the client (in the browser)
    _handleVisibility: function _handleVisibility() {
      // Update the state to the visibility for this specific platform
      // (already resolved before injecting the config)
      this.setState({
        isVisible: !this.props._hideOnClient
      });
    },
    componentDidMount: function componentDidMount() {
      // Handle the visibility filtering when mounted
      this._handleVisibility();
    },
    render: function render() {
      // Handle conditional visibility
      var isVisible = this.state.isVisible;

      // Render either the component that is wrapped or nothing

      return isVisible ? _react2.default.createElement(Component, this.props) : null;
    }
  });

  // Return a decorated component with all the existing static methods hoisted
  return (0, _hoistNonReactStatics2.default)(withVisibility, Component);
};

// Utils
// Dependencies