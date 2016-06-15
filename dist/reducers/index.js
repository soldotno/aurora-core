'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootReducer;

var _matchWhenEs = require('match-when-es5');

var _auroraDeepSliceMerge = require('aurora-deep-slice-merge');

var _actions = require('../actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Dependencies
                                                                                                                                                                                                                   */


/**
 * Import all the constants
 * we are going to use
 */


/**
 * Create and export our state reducer
 */
function rootReducer(state, action) {
  var _match;

  switch (action.type) {
    case _actions.REPLACE_STATE:
      return Object.assign({}, state, action.state);

    case _actions.REFRESH_CONFIG_PENDING:
      return Object.assign({}, state, {
        pagination: Object.assign({}, state.pagination, {
          isLoading: true
        })
      });

    case _actions.REFRESH_CONFIG_SUCCESS:
      return Object.assign({}, state, {
        config: Object.assign({}, action.data.config),
        pagination: Object.assign({}, state.pagination, {
          isLoading: false,
          hasMore: true,
          page: 0
        }),
        version: action.meta.version
      });

    case _actions.REFRESH_CONFIG_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });

    case _actions.POPULATE_NEXT_PAGE_PENDING:
      return Object.assign({}, state, {
        pagination: Object.assign({}, state.pagination, {
          isLoading: true
        })
      });

    case _actions.POPULATE_NEXT_PAGE_SUCCESS:
      return Object.assign({}, state, {
        config: (0, _matchWhenEs.match)(action.meta.operation, (_match = {}, _defineProperty(_match, (0, _matchWhenEs.when)('merge'), function () {
          return Object.assign({}, (0, _auroraDeepSliceMerge.merge)(state.config, action.data.config));
        }), _defineProperty(_match, (0, _matchWhenEs.when)('append'), function () {
          return Object.assign({}, (0, _auroraDeepSliceMerge.append)(state.config, action.data.modules));
        }), _defineProperty(_match, (0, _matchWhenEs.when)(), function () {
          return Object.assign({}, (0, _auroraDeepSliceMerge.merge)(state.config, action.data.config));
        }), _match)),
        pagination: Object.assign({}, state.pagination, {
          isLoading: false,
          hasMore: (action.meta.pagination || {}).hasMore,
          page: state.pagination.page + 1
        }),
        version: action.meta.version
      });

    case _actions.POPULATE_NEXT_PAGE_ERROR:
      return Object.assign({}, state, {
        error: action.error
      });

    default:
      return state;
  }
}