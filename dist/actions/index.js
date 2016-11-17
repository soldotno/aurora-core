'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var getRoute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return console.warn('No getRoute() method supplied to constructor');
  };

  /**
   * Pending action for
   * refreshing the config
   */
  function refreshConfigPending() {
    return {
      type: REFRESH_CONFIG_PENDING
    };
  }

  /**
   * Success action for
   * refreshing the config
   */
  function refreshConfigSuccess(_ref) {
    var meta = _ref.meta,
        data = _ref.data;

    return {
      type: REFRESH_CONFIG_SUCCESS,
      meta: meta,
      data: data
    };
  }

  /**
   * Error action for
   * refreshing the config
   */
  function refreshConfigError(error) {
    return {
      type: REFRESH_CONFIG_ERROR,
      error: error
    };
  }

  /**
   * Pending action for
   * populating the next
   * page of the config
   */
  function populateNextPagePending() {
    return {
      type: POPULATE_NEXT_PAGE_PENDING
    };
  }

  /**
   * Success action for
   * populating the next
   * page of the config
   */
  function populateNextPageSuccess(_ref2) {
    var meta = _ref2.meta,
        data = _ref2.data;

    return {
      type: POPULATE_NEXT_PAGE_SUCCESS,
      meta: meta,
      data: data
    };
  }

  /**
   * Error action for
   * populating the next
   * page of the config
   */
  function populateNextPageError(error) {
    return {
      type: POPULATE_NEXT_PAGE_ERROR,
      error: error
    };
  }

  return {
    /**
     * Exposed action creator
     * for refreshing the config
     */
    refreshConfig: function refreshConfig() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref3$path = _ref3.path,
          path = _ref3$path === undefined ? '/' : _ref3$path,
          _ref3$query = _ref3.query,
          query = _ref3$query === undefined ? {} : _ref3$query;

      return function (dispatch, getState) {
        var _getState = getState(),
            _getState$pagination$ = _getState.pagination.initialLimit,
            initialLimit = _getState$pagination$ === undefined ? 5 : _getState$pagination$,
            _getState$settings = _getState.settings,
            settings = _getState$settings === undefined ? {} : _getState$settings;

        /**
         * Dispatch the pending action for
         * refreshing the config to signal
         * that we've initiated the request
         * and that things are loading
         */


        dispatch(refreshConfigPending());

        /**
         * Initiate the request for retrieving
         * the config for our given input options
         */
        return getRoute({
          path: path,
          query: query,
          skip: 0,
          limit: initialLimit,
          page: 0,
          settings: settings
        }).then(function (result) {
          /**
           * Dispatch the success action of retrieving
           * the config when everything succeeds,
           * with the config as payload
           */
          return dispatch(refreshConfigSuccess(result));
        }).catch(function (err) {
          /**
           * Dispatch the error action of retrieving
           * the config when something fails,
           * with the error as payload
           */
          return dispatch(refreshConfigError(err));
        });
      };
    },

    /**
     * Exposed action creator
     * for populating the next
     * page of the config
     */
    populateNextPage: function populateNextPage() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$path = _ref4.path,
          path = _ref4$path === undefined ? '/' : _ref4$path,
          _ref4$query = _ref4.query,
          query = _ref4$query === undefined ? {} : _ref4$query;

      return function (dispatch, getState) {
        var _getState2 = getState(),
            _getState2$pagination = _getState2.pagination,
            _getState2$pagination2 = _getState2$pagination.page,
            page = _getState2$pagination2 === undefined ? 0 : _getState2$pagination2,
            _getState2$pagination3 = _getState2$pagination.perPage,
            perPage = _getState2$pagination3 === undefined ? 5 : _getState2$pagination3,
            _getState2$pagination4 = _getState2$pagination.initialLimit,
            initialLimit = _getState2$pagination4 === undefined ? 0 : _getState2$pagination4,
            _getState2$settings = _getState2.settings,
            settings = _getState2$settings === undefined ? {} : _getState2$settings,
            _getState2$version = _getState2.version,
            version = _getState2$version === undefined ? '' : _getState2$version;

        /**
         * Dispatch the pending action for
         * retrieving the next page of the config
         * to signal that we've initiated the request
         * and that things are loading
         */


        dispatch(populateNextPagePending());

        /**
         * Initiate the request for retrieving
         * the config for our given input options
         */
        return getRoute({
          path: path,
          query: query,
          skip: page * perPage + initialLimit,
          limit: perPage,
          settings: settings,
          page: page,
          version: version
        }).then(function (result) {
          /**
           * Dispatch the success action of retrieving
           * the config when everything succeeds,
           * with the config as payload
           */
          return dispatch(populateNextPageSuccess(result));
        }).catch(function (err) {
          /**
           * Dispatch the error action of retrieving
           * the config when something fails,
           * with the error as payload
           */
          return dispatch(populateNextPageError(err));
        });
      };
    },
    replaceState: function replaceState(state) {
      return {
        type: REPLACE_STATE,
        state: state
      };
    }
  };
};

/**
 * Constants for naming
 * and referencing action types
 */
var REPLACE_STATE = exports.REPLACE_STATE = 'REPLACE_STATE';
var REFRESH_CONFIG_PENDING = exports.REFRESH_CONFIG_PENDING = 'REFRESH_CONFIG_PENDING';
var REFRESH_CONFIG_SUCCESS = exports.REFRESH_CONFIG_SUCCESS = 'REFRESH_CONFIG_SUCCESS';
var REFRESH_CONFIG_ERROR = exports.REFRESH_CONFIG_ERROR = 'REFRESH_CONFIG_ERROR';
var POPULATE_NEXT_PAGE_PENDING = exports.POPULATE_NEXT_PAGE_PENDING = 'POPULATE_NEXT_PAGE_PENDING';
var POPULATE_NEXT_PAGE_SUCCESS = exports.POPULATE_NEXT_PAGE_SUCCESS = 'POPULATE_NEXT_PAGE_SUCCESS';
var POPULATE_NEXT_PAGE_ERROR = exports.POPULATE_NEXT_PAGE_ERROR = 'POPULATE_NEXT_PAGE_ERROR';

/**
 * Export a constructor function for the actions
 * (Since we need to inject dependencies)
 */