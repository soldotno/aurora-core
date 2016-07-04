/**
 * Dependencies
 */
const React = require('react'); // eslint-disable-line no-unused-vars
const ReactDOM = require('react-dom');
const qs = require('qs');
const pick = require('lodash.pick');

/**
 * Utilities
 */
const isUndefined = require('../utils/is-undefined');
const onResize = require('../utils/on-resize');
const history = require('../utils/history-api');
const handleScrollPosition = require('../utils/handle-scroll-position');
const removeFalsyKeysFromObject = require('../utils/remove-falsy-keys-from-object');
const updateQueryString = require('../utils/update-query-string');

/**
 * Components
 */
const ContextWrapper = require('../components/ContextWrapper');

/**
 * Import our store configuration function
 */
const configureStore = require('../store/configure-store').default;

/**
 * Create an instance of infinite scroll
 */
const infiniteScroll = require('everscroll')({
  distance: 1000,
  disableCallback: true
});

/**
 * Export function to be used as client renderer (extendable)
 */
module.exports = function ({
  getRoute = () => console.warn('No getRoute() method supplied to constructor'),
  getModule = () => console.warn('No getModule() method supplied to constructor'),
  isVisible = () => console.warn('No isVisible() method supplied to constructor'),
} = {}) {
  /**
   * Import and instantiate the necessary resolvers
   */
  const resolveModules = require('../utils/resolve-modules')(getModule);
  const resolveVisibility = require('../utils/resolve-visibility')(isVisible);

  /**
   * Import and instantiate action creators
   */
  const {
    replaceState,
    refreshConfig,
    populateNextPage,
  } = require('../actions').default(getRoute);

  /**
   * Parse the query string
   */
  const query = qs.parse((location.search || '').slice(1));

  /**
   * Get the original location
   */
  const originalLocation = window.location.pathname + window.location.search;

  /**
   * Pull out the pagination data
   * for the parsed query string
   */
  const paginationQuery = removeFalsyKeysFromObject({
    page: !isUndefined(query.page) ? +query.page : undefined,
    perPage: !isUndefined(query.perPage) ? +query.perPage : undefined,
    initialLimit: !isUndefined(query.initialLimit) ? +query.initialLimit : undefined,
    hasMore: !isUndefined(query.hasMore) ? +query.hasMore : undefined,
  });

  /**
   * Create a flag
   */
  const hasPaginationQuery = !!Object.keys(paginationQuery).length;

  /**
   * Pull out config feature flags from the server
   */
  const featureFlags = {
    enablePagination: true,
    enableScrollPositionMemory: true,
    enableVersioning: true,
    ...window.__flags,
  };

  /**
   * Get the latest available version
   */
  const latestVersion = window.__latestVersion || '';

  /**
   * Create the initial app state (redux)
   */
  const initialState = {
    error: null,
    version: query.version || window.__version || '',
    config: { ...window.__config },
    settings: { ...window.__settings },
    pagination: {
      page: 0,
      perPage: 10,
      initialLimit: 10,
      hasMore: true,
      isLoading: false,
      originalPath: window.location.pathname,
      ...window.__pagination,
      ...paginationQuery,
    },
  };

  /**
   * Create the redux store
   */
  const store = configureStore(initialState);

  /**
   * Create a function that adds the config version
   * to the query string
   */
  const updateVersionQuery = () => {
    const { version = '' } = store.getState();
    updateQueryString({ version });
  };

  /**
   * Create a function that adds the config and pagination
   * query to the history state and browser history
   */
  const updatePaginationQuery = () => {
    const { pagination } = store.getState();

    updateQueryString(pick(pagination, [
      'page',
      'perPage',
      'initialLimit',
      'hasMore',
    ]));
  };

  /**
   * Create a function that
   * renders the application
   */
  const renderApp = () => {
    /**
     * Pull the state we need
     * for rendering our app
     */
    const {
      version = '',
      config = {},
      settings = {},
      pagination = {},
    } = store.getState();

    /**
     * Resolve config
     */
    return Promise.resolve(config)
    .then(resolveVisibility.onClient.bind(null, settings, query))
    /**
     * Resolve modules (React components) in the config
     */
    .then(resolveModules)
    /**
     * Render React app
     *
     * NOTE: To be able to have login data
     * and global actions for logging in
     * and other actions that needs to be
     * available to every component in the
     * tree we pass them down via context
     * (available as this.context - see React docs)
     */
    .then(({ app: {
      type: App,
      options = {}
    } }) => {
      /**
       * Create a new Promise of rendering
       * the application
       */
      return new Promise((resolve) => {
        ReactDOM.render(
          <ContextWrapper
            actions={{}}
            settings={settings}
          >
            <App
              newVersionAvailable={latestVersion !== version}
              pagination={pagination}
              {...options}
            />
          </ContextWrapper>,
          document.querySelector('#app'),
          /**
           * NOTE: We're using the callback available for ReactDOM.render
           * to be able to know when the rendering is done (async).
           */
          () => resolve()
        );
      });
    })
    /**
     * Make sure errors are thrown
     */
    .catch((err) => setImmediate(() => {
      throw err;
    }));
  };

  /**
   * Listen to store changes and
   * re-render app if anything has changed
   */
  store.subscribe(() => {
    renderApp();
  });

  /**
   * Re-render on resize
   */
  onResize(() => {
    renderApp();
  });

  /**
   * Handle the rendering flow
   */
  Promise.resolve()
  /**
   * Perform the initial rendering
   * (Will resolve when the actual rendering is done)
   */
  .then(() => renderApp())
  /**
   * Handle rendering stuff from cache
   * (Back button memory)
   */
  .then(() => {
    /**
     * Pull out history state
     */
    const cacheState = history.state || {};

    /**
     * Pull out the modules list of the current config from redux state
     */
    const { config: {
      app: {
        options: {
          modules = [],
        } = {},
      } = {},
    } = {} } = store.getState() || {};

    /**
     * Check if the current config has any modules
     */
    const currentConfigHasModules = !!modules.length;

    /**
     * Figure out if you should replace the config
     * - If there is a pagination query
     * - (and) If there is no modules in the current config
     */
    const shouldReplaceState = hasPaginationQuery && !currentConfigHasModules;

    /**
     * Dispatch an action that replaces the
     * current config with the one in cache
     */
    return shouldReplaceState ? (
      store.dispatch(replaceState(cacheState))
    ) : (
      Promise.resolve()
    );
  })
  /**
   * Make sure we render the app fully at least once
   * before we do the scrolling (restore position)
   */
  .then(() => renderApp())
  /**
   * Handle route features on first render
   * NOTE: Depends on the config meta flags (features toggles)
   *
   * Could be things like:
   * - Scroll position memory
   */
  .then(() => {
    /**
     * Scroll to the previous location if
     * returning from an outbound visit (back-button)
     */
    featureFlags.enableScrollPositionMemory && handleScrollPosition(originalLocation);
  })
  /**
   * Handle edge cases where we have no config
   * available after loading the page
   */
  .then(() => {
    /**
     * Pull out the modules list of the current config from redux state
     */
    const { config: {
      app: {
        options: {
          modules = [],
        } = {},
      } = {},
    } = {} } = store.getState() || {};

    /**
     * Check if the current config has any modules
     */
    const currentConfigHasModules = !!modules.length;

    /**
     * If we have no config to render - populate one
     * (this happens if you render on client only - like in development)
     *
     * If we have a config but no modules to render - populate the next page
     * (this happens when you render dynamic configs with geolocation - since that is a client only feature)
     */
    if (!currentConfigHasModules) {
      store.dispatch(refreshConfig({
        path: location.pathname,
        query: qs.parse(location.search.slice(1)),
      }));
    }
  })
  /**
   * Handle infinite scroll / pagination
   */
  .then(() => {
    /**
     * Infinite scroll handler
     */
    infiniteScroll(() => {
      /**
       * Destructure what we need from the state
       */
      const {
        pagination: {
          isLoading,
          hasMore,
          originalPath,
        } = {},
      } = store.getState();

      /**
       * If we're already loading the next page
       * or if we know that there is no more
       * pages to fetch - then abort
       */
      if (isLoading || !hasMore) {
        return;
      }

      /**
       * Tell Redux to populate
       * the next part of the config
       */
      store.dispatch(populateNextPage({
        path: originalPath || location.pathname,
        query: qs.parse(location.search.slice(1)),
      }))
      /**
       * Handle application features on subsequent updates
       * NOTE: Depends on the config meta flags (features toggles)
       *
       * Could be things like:
       * - Dynamic pagination
       * - Scroll position memory
       */
      .then(() => {
        /**
         * Get the entire redux state
         */
        const currentState = store.getState();

        /**
         * Handle features that are behind flags, such as
         * - Back position memory
         * - State caching
         */
        featureFlags.enablePagination && updatePaginationQuery();
        featureFlags.enableScrollPositionMemory && history.replaceState(currentState, null);
        featureFlags.enableVersioning && updateVersionQuery();
      });
    });
  });
};
