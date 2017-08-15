/**
 * Constants for naming
 * and referencing action types
 */
export const REPLACE_STATE = 'REPLACE_STATE';
export const REFRESH_CONFIG_PENDING = 'REFRESH_CONFIG_PENDING';
export const REFRESH_CONFIG_SUCCESS = 'REFRESH_CONFIG_SUCCESS';
export const REFRESH_CONFIG_ERROR = 'REFRESH_CONFIG_ERROR';
export const POPULATE_NEXT_PAGE_PENDING = 'POPULATE_NEXT_PAGE_PENDING';
export const POPULATE_NEXT_PAGE_SUCCESS = 'POPULATE_NEXT_PAGE_SUCCESS';
export const POPULATE_NEXT_PAGE_ERROR = 'POPULATE_NEXT_PAGE_ERROR';

/**
 * Export a constructor function for the actions
 * (Since we need to inject dependencies)
 */
export default function (
  getRoute = () => console.warn('No getRoute() method supplied to constructor')
) {
  /**
   * Pending action for
   * refreshing the config
   */
  function refreshConfigPending() {
    return {
      type: REFRESH_CONFIG_PENDING,
    };
  }

  /**
   * Success action for
   * refreshing the config
   */
  function refreshConfigSuccess({ meta, data }) {
    return {
      type: REFRESH_CONFIG_SUCCESS,
      meta,
      data,
    };
  }

  /**
   * Error action for
   * refreshing the config
   */
  function refreshConfigError(error) {
    return {
      type: REFRESH_CONFIG_ERROR,
      error,
    };
  }

  /**
   * Pending action for
   * populating the next
   * page of the config
   */
  function populateNextPagePending() {
    return {
      type: POPULATE_NEXT_PAGE_PENDING,
    };
  }

  /**
   * Success action for
   * populating the next
   * page of the config
   */
  function populateNextPageSuccess({ meta, data }) {
    return {
      type: POPULATE_NEXT_PAGE_SUCCESS,
      meta,
      data,
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
      error,
    };
  }

  return {
    /**
     * Exposed action creator
     * for refreshing the config
     */
    refreshConfig({
      path = '/',
      query = {},
    } = {}) {
      return (dispatch, getState) => {
        const {
          pagination: {
            initialLimit = 5,
          },
          settings = {},
        } = getState();

        // Account for that we might have a shell config
        settings.route = path;

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
          path,
          query,
          skip: 0,
          limit: initialLimit,
          page: 0,
          settings,
        })
          .then((result) => {
            /**
             * Dispatch the success action of retrieving
             * the config when everything succeeds,
             * with the config as payload
             */
            return dispatch(refreshConfigSuccess(result));
          })
          .catch((err) => {
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
    populateNextPage({
      path = '/',
      query = {},
    } = {}) {
      return (dispatch, getState) => {
        const {
          pagination: {
            page = 0,
            perPage = 5,
            initialLimit = 0,
          },
          settings = {},
          version = '',
        } = getState();

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
          path,
          query,
          skip: (page * perPage) + initialLimit,
          limit: perPage,
          settings,
          page,
          version,
        })
          .then((result) => {
          /**
           * Dispatch the success action of retrieving
           * the config when everything succeeds,
           * with the config as payload
           */
            return dispatch(populateNextPageSuccess(result));
          })
          .catch((err) => {
          /**
           * Dispatch the error action of retrieving
           * the config when something fails,
           * with the error as payload
           */
            return dispatch(populateNextPageError(err));
          });
      };
    },
    replaceState(state) {
      return {
        type: REPLACE_STATE,
        state,
      };
    },
  };
}
