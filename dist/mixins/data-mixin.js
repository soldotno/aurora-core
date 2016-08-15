'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Dependencies
 */
var React = require('react');

/**
 * Export a mixin that handles
 * data fetching on both the client
 * and server for Aurora modules
 */
module.exports = function (stateName, errorName) {
  return {
    /**
     * These are the props
     * that will be supplied
     * by the config
     */
    propTypes: {
      _dataOptions: React.PropTypes.object,
      _data: React.PropTypes.object
    },

    /**
     * These are the context
     * that will be supplied by
     * the top renderer
     */
    contextTypes: {
      settings: React.PropTypes.object
    },

    /**
     * Set some appropriate
     * default props
     */
    getDefaultProps: function getDefaultProps() {
      return {
        _dataOptions: {},
        _data: null
      };
    },


    /**
     * Set the initial data
     * state to what we got from
     * props (might have been loaded server-side)
     */
    getInitialState: function getInitialState() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, stateName, this.props._data), _defineProperty(_ref, errorName, false), _ref;
    },


    /**
     * Handle updates with new props
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var _this = this;

      var _props$_hideOnClient = this.props._hideOnClient;

      var _hideOnClient = _props$_hideOnClient === undefined ? false : _props$_hideOnClient;

      !this.state[stateName] && this.setState(_defineProperty({}, stateName, nextProps._data), function () {
        !_hideOnClient && _this._handleData();
      });
    },


    /**
     * General instance method
     * for handling data loading
     */
    _handleData: function _handleData() {
      var _this2 = this;

      /**
       * Pull out what we need from props
       */
      var _props = this.props;
      var _data = _props._data;
      var _props$_dataOptions = _props._dataOptions;

      var _dataOptions = _props$_dataOptions === undefined ? {} : _props$_dataOptions;

      /**
       * Pull out what we need from context
       */


      var _context$settings = this.context.settings;
      var settings = _context$settings === undefined ? {} : _context$settings;

      /**
       * Pull the 'getData' method
       * that all modules which need
       * data fetching must implement
       */

      var _constructor$getData = this.constructor.getData;
      var getData = _constructor$getData === undefined ? function () {
        return Promise.resolve({ crap: 5 });
      } : _constructor$getData;

      /**
       * Check if data was loaded server-side.
       * If not - we fetch the data client-side
       * and update the state
       *
       * We'll also add add the global settings to
       * the request implicitely
       */

      if (!_data) {
        getData(Object.assign({}, { __settings: settings }, _dataOptions)).then(function (_data) {
          return _this2.setState(_defineProperty({}, stateName, _data));
        }).catch(function (_data) {
          return _this2.setState(_defineProperty({}, errorName, _data));
        });
      }
    },
    componentDidMount: function componentDidMount() {
      /**
       * We'll assume the component is using
       * aurora-visibility-mixin, if not
       * we'll default to performing the handling
       */
      var _props$_hideOnClient2 = this.props._hideOnClient;

      var _hideOnClient = _props$_hideOnClient2 === undefined ? false : _props$_hideOnClient2;

      /**
       * Only do data handling if the
       * component will be visible on the client
       *
       * We'll assume the component is using
       * aurora-visibility-mixin, if not
       * we'll default to performing the handling
       */


      !_hideOnClient && this._handleData();
    }
  };
};