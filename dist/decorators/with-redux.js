'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Dependencies
                                                                                                                                                                                                                                                                               */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
module.exports = function (_ref) {
  var _ref$reducer = _ref.reducer;
  var reducer = _ref$reducer === undefined ? function () {
    return console.log('No reducer supplied');
  } : _ref$reducer;
  var _ref$initialState = _ref.initialState;
  var initialState = _ref$initialState === undefined ? {} : _ref$initialState;

  /**
   * Create a logger (and default to pass-through if not browser)
   */
  var logger = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? (0, _reduxLogger2.default)() : function () {
    return function (next) {
      return function (action) {
        return next(action);
      };
    };
  };

  /**
   * Create developer tools middleware
   */
  var devTools = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : function (f) {
    return f;
  };

  /**
   * Compose a store creator function with middleware
   */
  var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default, logger), devTools)(_redux.createStore);

  /**
   * Create a Redux store
   */
  var makeStore = finalCreateStore.bind(null, reducer, initialState);

  /**
   * Return a function that extends
   * a component with redux state handling
   */
  return function (Component) {
    /**
     * Create a component that wraps
     * our input component in a Redux <Provider>
     */
    var withRedux = _react2.default.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withRedux',

      /**
       * Create a new Redux store for
       * each component instance,
       * to avoid sharing state between instances
       */
      getInitialState: function getInitialState() {
        return {
          store: makeStore()
        };
      },


      /**
       * Render the component wrapped
       * in a Redux <Provider> to expose
       * the store and give children the
       * ability to connect()
       */
      render: function render() {
        return _react2.default.createElement(
          _reactRedux.Provider,
          { store: this.state.store },
          _react2.default.createElement(Component, this.props)
        );
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return (0, _hoistNonReactStatics2.default)(withRedux, Component);
  };
};