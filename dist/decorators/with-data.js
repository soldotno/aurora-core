'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Dependencies
 */
var React = require('react');
var hoistStatics = require('hoist-non-react-statics');
/**
 * Aurora mixins
 */
var DataMixin = require('../mixins/data-mixin');

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
module.exports = function (_ref) {
  var _ref$fetchData = _ref.fetchData;
  var fetchData = _ref$fetchData === undefined ? function () {
    return Promise.resolve();
  } : _ref$fetchData;
  var _ref$dataProp = _ref.dataProp;
  var dataProp = _ref$dataProp === undefined ? 'data' : _ref$dataProp;
  var _ref$loadingProp = _ref.loadingProp;
  var loadingProp = _ref$loadingProp === undefined ? 'isLoading' : _ref$loadingProp;
  var _ref$errorProp = _ref.errorProp;
  var errorProp = _ref$errorProp === undefined ? 'error' : _ref$errorProp;
  var _ref$disableServerLoa = _ref.disableServerLoading;
  var disableServerLoading = _ref$disableServerLoa === undefined ? false : _ref$disableServerLoa;

  return function (Component) {
    var withData = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withData',

      /**
       * Add static methods needed
       */
      statics: {
        getData: function getData(options) {
          /**
           * The options object will have
           * user defined settings (from getUserSettings)
           * available as options.__settings
           */
          if (disableServerLoading && typeof window === 'undefined') {
            return Promise.resolve();
          } else {
            return fetchData(options);
          }
        }
      },

      /**
       * Add applicable mixins
       */
      mixins: [DataMixin('__data', '__error')],

      /**
       * Render the component
       */
      render: function render() {
        var _data;

        var data = (_data = {}, _defineProperty(_data, dataProp, this.state.__data), _defineProperty(_data, loadingProp, !this.state.__data), _defineProperty(_data, errorProp, this.state.__error), _data);

        return React.createElement(Component, _extends({}, this.props, data, {
          reloadFunction: this._handleData
        }));
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return hoistStatics(withData, Component);
  };
};