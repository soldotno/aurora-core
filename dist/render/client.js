'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Dependencies
 */
var React = require('react'); // eslint-disable-line no-unused-vars
var ReactDOM = require('react-dom');
var qs = require('qs');
var pick = require('lodash.pick');
/**
 * Utilities
 */
var isUndefined = require('../utils/is-undefined');
var onResize = require('../utils/on-resize');
var history = require('../utils/history-api');
var handleScrollPosition = require('../utils/handle-scroll-position');
var removeFalsyKeysFromObject = require('../utils/remove-falsy-keys-from-object');
var updateQueryString = require('../utils/update-query-string');
var sortedObject = require('sorted-object');
/**
 * Components
 */
var ContextWrapper = require('../components/ContextWrapper');

/**
 * Import our store configuration function
 */
var configureStore = require('../store/configure-store').default;

/**
 * Create an instance of infinite scroll
 */
var infiniteScroll = require('everscroll')({
  distance: 1500,
  disableCallback: true
});

/**
 * Export function to be used as client renderer (extendable)
 */
module.exports = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref$getRoute = _ref.getRoute;
  var getRoute = _ref$getRoute === undefined ? function () {
    return console.warn('No getRoute() method supplied to constructor');
  } : _ref$getRoute;
  var _ref$getModule = _ref.getModule;
  var getModule = _ref$getModule === undefined ? function () {
    return console.warn('No getModule() method supplied to constructor');
  } : _ref$getModule;
  var _ref$isVisible = _ref.isVisible;
  var isVisible = _ref$isVisible === undefined ? function () {
    return console.warn('No isVisible() method supplied to constructor');
  } : _ref$isVisible;

  /**
   * Import and instantiate the necessary resolvers
   */
  var resolveModules = require('../utils/resolve-modules')(getModule);
  var resolveVisibility = require('../utils/resolve-visibility')(isVisible);

  /**
   * Import and instantiate action creators
   */

  var _require$default = require('../actions').default(getRoute);

  var replaceState = _require$default.replaceState;
  var refreshConfig = _require$default.refreshConfig;
  var populateNextPage = _require$default.populateNextPage;

  /**
   * Parse the query string
   */

  var query = qs.parse((location.search || '').slice(1));

  /**
   * Get the original location
   */
  var originalLocation = window.location.pathname + window.location.search;

  /**
   * Pull out the pagination data
   * for the parsed query string
   */
  var paginationQuery = removeFalsyKeysFromObject({
    page: !isUndefined(query.page) ? +query.page : undefined,
    perPage: !isUndefined(query.perPage) ? +query.perPage : undefined,
    initialLimit: !isUndefined(query.initialLimit) ? +query.initialLimit : undefined,
    hasMore: !isUndefined(query.hasMore) ? +query.hasMore : undefined
  });

  /**
   * Create a flag
   */
  var hasPaginationQuery = !!Object.keys(paginationQuery).length;

  /**
   * Pull out config feature flags from the server
   */
  var featureFlags = _extends({
    enablePagination: false,
    enableScrollPositionMemory: false,
    enableVersioning: false
  }, window.__flags);

  /**
   * Get the latest available version
   */
  var latestVersion = window.__latestVersion || '';

  /**
   * Create the initial app state (redux)
   */
  var initialState = {
    error: null,
    version: query.version || window.__version || '',
    config: _extends({}, window.__config),
    settings: _extends({}, window.__settings),
    pagination: _extends({
      page: 0,
      perPage: 10,
      initialLimit: 10,
      hasMore: true,
      isLoading: false,
      originalPath: window.location.pathname
    }, window.__pagination, paginationQuery)
  };

  /**
   * Create the redux store
   */
  var store = configureStore(initialState);

  /**
   * Create a function that adds the config version
   * to the query string
   */
  var updateVersionQuery = function updateVersionQuery() {
    var _store$getState = store.getState();

    var _store$getState$versi = _store$getState.version;
    var version = _store$getState$versi === undefined ? '' : _store$getState$versi;

    updateQueryString({ version: version });
  };

  /**
   * Create a function that adds the config and pagination
   * query to the history state and browser history
   */
  var updatePaginationQuery = function updatePaginationQuery() {
    var _store$getState2 = store.getState();

    var pagination = _store$getState2.pagination;


    updateQueryString(pick(pagination, ['page', 'perPage', 'initialLimit', 'hasMore']));
  };

  var appConfig = '{}';
  var paginationConf = '{}';
  /**
   * Create a function that
   * renders the application
   */
  var renderApp = function renderApp() {
    /**
     * Pull the state we need
     * for rendering our app
     */
    var _store$getState3 = store.getState();

    var _store$getState3$vers = _store$getState3.version;
    var version = _store$getState3$vers === undefined ? '' : _store$getState3$vers;
    var _store$getState3$conf = _store$getState3.config;
    var config = _store$getState3$conf === undefined ? {} : _store$getState3$conf;
    var _store$getState3$sett = _store$getState3.settings;
    var settings = _store$getState3$sett === undefined ? {} : _store$getState3$sett;
    var _store$getState3$pagi = _store$getState3.pagination;
    var pagination = _store$getState3$pagi === undefined ? {} : _store$getState3$pagi;


    var newAppConf = JSON.stringify(sortedObject(config.app || {}));
    var newPaginationConf = JSON.stringify(sortedObject(pagination || {}));
    if (appConfig === newAppConf && paginationConf === newPaginationConf) {
      // TODO: Now we assume that only changes on app and pagination is a reason to rerender!
      // will this be true in the future?
      return;
    }
    appConfig = newAppConf;
    paginationConf = newPaginationConf;
    /**
     * Resolve config
     */
    return Promise.resolve(config).then(resolveVisibility.onClient.bind(null, settings, query))
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
    .then(function (_ref2) {
      var _ref2$app = _ref2.app;
      var App = _ref2$app.type;
      var _ref2$app$options = _ref2$app.options;
      var options = _ref2$app$options === undefined ? {} : _ref2$app$options;

      /**
       * Create a new Promise of rendering
       * the application
       */
      return new Promise(function (resolve) {
        ReactDOM.render(React.createElement(
          ContextWrapper,
          {
            actions: {},
            settings: settings
          },
          React.createElement(App, _extends({
            newVersionAvailable: latestVersion !== version,
            pagination: pagination
          }, options))
        ), document.querySelector('#app'),
        /**
         * NOTE: We're using the callback available for ReactDOM.render
         * to be able to know when the rendering is done (async).
         */
        function () {
          return resolve();
        });
      });
    })
    /**
     * Make sure errors are thrown
     */
    .catch(function (err) {
      return setImmediate(function () {
        throw err;
      });
    });
  };

  /**
   * Listen to store changes and
   * re-render app if anything has changed
   */
  store.subscribe(function () {
    renderApp();
  });
  /**
   * Re-render on resize
   */
  onResize(function () {
    renderApp();
  });

  var loadMore = function loadMore() {
    /**
     * Destructure what we need from the state
     */
    var _store$getState4 = store.getState();

    var _store$getState4$pagi = _store$getState4.pagination;
    _store$getState4$pagi = _store$getState4$pagi === undefined ? {} : _store$getState4$pagi;
    var isLoading = _store$getState4$pagi.isLoading;
    var hasMore = _store$getState4$pagi.hasMore;
    var originalPath = _store$getState4$pagi.originalPath;

    /**
     * If we're already loading the next page
     * or if we know that there is no more
     * pages to fetch - then abort
     */

    if (isLoading || !hasMore) {
      return Promise.resolve(true);
    }

    /**
     * Tell Redux to populate
     * the next part of the config
     */
    return store.dispatch(populateNextPage({
      path: originalPath || location.pathname,
      query: qs.parse(location.search.slice(1))
    }))

    /**
     * Handle application features on subsequent updates
     * NOTE: Depends on the config meta flags (features toggles)
     *
     * Could be things like:
     * - Dynamic pagination
     * - Scroll position memory
     */
    .then(function () {
      /**
       * Get the entire redux state
       */
      var currentState = store.getState();

      /**
       * Handle features that are behind flags, such as
       * - Back position memory
       * - State caching
       * - Versioning
       */
      featureFlags.enablePagination && updatePaginationQuery();
      featureFlags.enableScrollPositionMemory && history.replaceState(currentState, null);
      featureFlags.enableVersioning && updateVersionQuery();
    });
  };

  /**
   * Loads so many articles that we have a scroll bar!
   */
  var loadMoreModulesThenLenghtOfViewPort = function loadMoreModulesThenLenghtOfViewPort() {
    loadMore().then(function (done) {
      if (done) return;
      if (isDocument4timesLongerThenViewPort()) {
        loadMoreModulesThenLenghtOfViewPort();
      } else {
        infiniteScroll(loadMore);
      }
    }).catch(function (err) {
      console.warn('Failed loading more modules', err);
    });
  };

  function isDocument4timesLongerThenViewPort() {
    var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var documentHeight = document.body.clientHeight;
    return viewPortHeight * 4 < documentHeight;
  }

  /**
   * Handle the rendering flow
   */
  Promise.resolve()
  /**
   * Perform the initial rendering
   * (Will resolve when the actual rendering is done)
   */
  .then(function () {
    return renderApp();
  })
  /**
   * Handle rendering stuff from cache
   * (Back button memory)
   */
  .then(function () {
    /**
     * Pull out history state
     */
    var cacheState = history.state || {};

    /**
     * Pull out the modules list of the current config from redux state
     */

    var _ref3 = store.getState() || {};

    var _ref3$config = _ref3.config;
    _ref3$config = _ref3$config === undefined ? {} : _ref3$config;
    var _ref3$config$app = _ref3$config.app;
    _ref3$config$app = _ref3$config$app === undefined ? {} : _ref3$config$app;
    var _ref3$config$app$opti = _ref3$config$app.options;
    _ref3$config$app$opti = _ref3$config$app$opti === undefined ? {} : _ref3$config$app$opti;
    var _ref3$config$app$opti2 = _ref3$config$app$opti.modules;
    var modules = _ref3$config$app$opti2 === undefined ? [] : _ref3$config$app$opti2;

    /**
     * Check if the current config has any modules
     */

    var currentConfigHasModules = !!modules.length;

    /**
     * Figure out if you should replace the config
     * - If there is a pagination query
     * - (and) If there is no modules in the current config
     */
    var shouldReplaceState = hasPaginationQuery && !currentConfigHasModules;

    /**
     * Dispatch an action that replaces the
     * current config with the one in cache
     */
    return shouldReplaceState ? store.dispatch(replaceState(cacheState)) : Promise.resolve();
  })
  // TODO:
  // Q:  Det er en promisechain hvor du skriver at du kaller `renderApp()` for å være sikker på at den er rendret 1 gang. Men hele promise chainen starer med nettopp et kall til ????`renderApp()`. Er dette bevist?
  // A: . Ja - fordi den helt første renderinga kan være uten moduler (fordi det ikke kommer noen moduler fra serveren om du enabler back-funksjonalitet), deretter lastes moduler fra cache, deretter rendres det på nytt i linje 289
  // FOLLOW UP:  Burde ikke  dette kunne gjøres av det som i dag ligger i scrollliseneren  hvis vi bytter den fra å være en scroll lisner, til å bare sjekke om det er 1000 px igjen til kanten. Det er flere tilfeler vi har hvor vi skulle rendra mer, men kommer i en state hvor vi ikke har gjort det.
  //  * Make sure we render the app fully at least once
  //  * before we do the scrolling (restore position)
  //  */
  // .then(() => renderApp())
  /**
   * Handle route features on first render
   * NOTE: Depends on the config meta flags (features toggles)
   *
   * Could be things like:
   * - Scroll position memory
   */
  .then(function () {
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
  .then(function () {
    /**
     * Pull out the modules list of the current config from redux state
     */
    var _ref4 = store.getState() || {};

    var _ref4$config = _ref4.config;
    _ref4$config = _ref4$config === undefined ? {} : _ref4$config;
    var _ref4$config$app = _ref4$config.app;
    _ref4$config$app = _ref4$config$app === undefined ? {} : _ref4$config$app;
    var _ref4$config$app$opti = _ref4$config$app.options;
    _ref4$config$app$opti = _ref4$config$app$opti === undefined ? {} : _ref4$config$app$opti;
    var _ref4$config$app$opti2 = _ref4$config$app$opti.modules;
    var modules = _ref4$config$app$opti2 === undefined ? [] : _ref4$config$app$opti2;

    /**
     * Check if the current config has any modules
     */

    var currentConfigHasModules = !!modules.length;

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
        query: qs.parse(location.search.slice(1))
      }));
    }
  })
  /**
   * Handle infinite scroll / pagination
   */
  .then(function () {
    loadMoreModulesThenLenghtOfViewPort();
  });
};