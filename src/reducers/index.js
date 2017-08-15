/**
 * Dependencies
 */
import { match, when } from 'match-when-es5';
import { merge, append } from 'aurora-deep-slice-merge';

/**
 * Import all the constants
 * we are going to use
 */
import {
  REPLACE_STATE,
  REFRESH_CONFIG_PENDING,
  REFRESH_CONFIG_SUCCESS,
  REFRESH_CONFIG_ERROR,
  POPULATE_NEXT_PAGE_PENDING,
  POPULATE_NEXT_PAGE_SUCCESS,
  POPULATE_NEXT_PAGE_ERROR,
} from '../actions';

/**
 * Create and export our state reducer
 */
export default function rootReducer(state, action) {
  switch (action.type) {
    case REPLACE_STATE:
      return Object.assign({}, state, action.state);

    case REFRESH_CONFIG_PENDING:
      return Object.assign({}, state, {
        pagination: Object.assign({}, state.pagination, {
          isLoading: true,

          // Account for shell configs
          originalPath: window.location.pathname,
        }),
      });

    case REFRESH_CONFIG_SUCCESS:
      return Object.assign({}, state, {
        config: Object.assign({}, action.data.config),
        pagination: Object.assign({}, state.pagination, {
          isLoading: false,
          hasMore: true,
          page: 0,
        }),
        version: action.meta.version,
      });

    case REFRESH_CONFIG_ERROR:
      return Object.assign({}, state, {
        error: action.error,
      });

    case POPULATE_NEXT_PAGE_PENDING:
      return Object.assign({}, state, {
        pagination: Object.assign({}, state.pagination, {
          isLoading: true,
        }),
      });

    case POPULATE_NEXT_PAGE_SUCCESS:
      return Object.assign({}, state, {
        config: match(action.meta.operation, {
          [when('merge')]: () => Object.assign({}, merge(state.config, action.data.config)),
          [when('append')]: () => Object.assign({}, append(state.config, action.data.modules)),
          [when()]: () => Object.assign({}, merge(state.config, action.data.config)),
        }),
        pagination: Object.assign({}, state.pagination, {
          isLoading: false,
          hasMore: (action.meta.pagination || {}).hasMore,
          page: state.pagination.page + 1,
        }),
        version: action.meta.version,
      });

    case POPULATE_NEXT_PAGE_ERROR:
      return Object.assign({}, state, {
        error: action.error,
      });

    default:
      return state;
  }
}
