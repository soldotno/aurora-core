'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Dependencies
 */
var React = require('react');
var hoistStatics = require('hoist-non-react-statics');

var _require = require('redux');

var createStore = _require.createStore;
var applyMiddleware = _require.applyMiddleware;
var compose = _require.compose;

var thunk = require('redux-thunk');
var createLogger = require('redux-logger');

var _require2 = require('react-redux');

var Provider = _require2.Provider;

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
  var logger = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? createLogger() : function () {
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
  var finalCreateStore = compose(applyMiddleware(thunk, logger), devTools)(createStore);

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
    var withRedux = React.createClass({
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
        return React.createElement(
          Provider,
          { store: this.state.store },
          React.createElement(Component, this.props)
        );
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return hoistStatics(withRedux, Component);
  };
};