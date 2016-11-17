'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Dependencies
                                                                                                                                                                                                                                                                               */


/**
 * Reducers
 */


exports.default = configureStore;

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a logger
 */
var logger = (0, _reduxLogger2.default)();

/**
 * Export a function that
 * creates a store with
 * an optional initial state
 */
function configureStore(initialState) {
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
   * Create the actual store
   */
  var store = finalCreateStore(_reducers2.default, initialState);

  /**
   * Enable Webpack hot module replacement for reducers
   */
  if (module.hot) {
    module.hot.accept('../reducers', function () {
      var nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  /**
   * Return the store
   */
  return store;
}