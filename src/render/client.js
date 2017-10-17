/* eslint-disable no-underscore-dangle */
// Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import qs from 'qs';
import pick from 'lodash.pick';
import createDebug from 'debug';
import sortedObject from 'sorted-object';
import everscroll from 'everscroll';

// Utilities
import isUndefined from '../utils/is-undefined';
import onResize from '../utils/on-resize';
import history from '../utils/history-api';
import handleScrollPosition from '../utils/handle-scroll-position';
import removeFalsyKeysFromObject from '../utils/remove-falsy-keys-from-object';
import updateQueryString from '../utils/update-query-string';
import createResolveModules from '../utils/resolve-modules';
import createResolveVisibility from '../utils/resolve-visibility';

// Actions
import createActions from '../actions';

// Components
import ContextWrapper from '../components/ContextWrapper';

// Import our store configuration function
import configureStore from '../store/configure-store';

// Create an instance of infinite scroll
const infiniteScroll = everscroll({
  distance: 4500,
  disableCallback: true,
});

const debug = createDebug('aurora-core:render/client.js');

/**
* Export function to be used as client renderer (extendable)
*/
export default function renderClient({
  getRoute = () => console.warn('No getRoute() method supplied to constructor'),
  getModule = () => console.warn('No getModule() method supplied to constructor'),
  isVisible = () => console.warn('No isVisible() method supplied to constructor'),
  settings = window.__settings,
} = {}) {
  // Instantiate the necessary resolvers
  const resolveModules = createResolveModules(getModule);
  const resolveVisibility = createResolveVisibility(isVisible);

  // Import and instantiate action creators
  const {
    replaceState,
    refreshConfig,
    populateNextPage,
  } = createActions(getRoute);

  // Parse the query string
  const query = qs.parse((location.search || '').slice(1));

  // Get the original location
  const originalLocation = window.location.pathname + window.location.search;

  // Pull out the pagination data for the parsed query string
  const paginationQuery = removeFalsyKeysFromObject({
    page: !isUndefined(query.page) ? +query.page : undefined,
    perPage: !isUndefined(query.perPage) ? +query.perPage : undefined,
    initialLimit: !isUndefined(query.initialLimit) ? +query.initialLimit : undefined,
    hasMore: !isUndefined(query.hasMore) ? +query.hasMore : undefined,
  });

  // Create a flag
  const hasPaginationQuery = !!Object.keys(paginationQuery).length;

  // Pull out config feature flags from the server
  const featureFlags = {
    enablePagination: false,
    enableScrollPositionMemory: false,
    enableVersioning: false,
    ...window.__flags,
  };

  // Get the latest available version
  const latestVersion = window.__latestVersion || '';

  // Create the initial app state (redux)
  const initialState = {
    error: null,
    version: query.version || window.__version || '',
    config: { ...window.__config },
    settings,
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

  // Create the redux store
  const store = configureStore(initialState);

  // Create a function that adds the config version to the query string
  const updateVersionQuery = () => {
    const { version = '' } = store.getState();
    updateQueryString({ version });
  };

  // Create a function that adds the config and pagination
  // query to the history state and browser history
  const updatePaginationQuery = () => {
    const { pagination } = store.getState();

    updateQueryString(pick(pagination, [
      'page',
      'perPage',
      'initialLimit',
      'hasMore',
    ]));
  };

  let appConfig = '{}';
  let paginationConf = '{}';
  let errorConf = 'null';

  // Create a function that renders the application
  const renderApp = () => {
    // Pull the state we need for rendering our app
    const {
      version = '',
      config = {},
      settings = {},
      pagination = {},
      error = null,
    } = store.getState();

    const newAppConf = JSON.stringify(sortedObject(config.app || {}));
    const newPaginationConf = JSON.stringify(sortedObject(pagination || {}));
    const newErrorConf = JSON.stringify(sortedObject(error || {}));

    if (
      appConfig === newAppConf
      && paginationConf === newPaginationConf
      && errorConf === newErrorConf
    ) {
      // TODO: Now we assume that only changes on app and pagination is a reason to rerender!
      // will this be true in the future?
      return;
    }
    appConfig = newAppConf;
    paginationConf = newPaginationConf;
    errorConf = newErrorConf;

    // Resolve config
    return Promise.resolve(config) // eslint-disable-line consistent-return
      .then(resolveVisibility.onClient.bind(null, settings, query))

    // Resolve modules (React components) in the config
      .then(resolveModules)

    // Render React app
    //
    // NOTE: To be able to have login data and global actions for logging in
    // and other actions that needs to be available to every component in the
    // tree we pass them down via context (available as this.context -
    // see React docs)
      .then(({ app: {
        type: App,
        options = {},
      } }) => {
      // Create a new Promise of rendering the application
        return new Promise((resolve) => {
          ReactDOM.render(
            <ContextWrapper
              actions={{}}
              settings={settings}
            >
              <App
                newVersionAvailable={latestVersion !== version}
                pagination={pagination}
                error={error}
                {...options}
              />
            </ContextWrapper>,
            document.querySelector('#app'),

            /*
          NOTE: We're using the callback available for ReactDOM.render
          to be able to know when the rendering is done (async).
          */
            () => resolve()
          );
        });
      })

    // Make sure errors are thrown
      .catch(err => setImmediate(() => {
        throw err;
      }));
  };

  // Listen to store changes and re-render app if anything has changed
  store.subscribe(() => {
    renderApp();
  });

  // Re-render on resize
  onResize(() => {
    renderApp();
  });


  const loadMore = () => {
    // Destructure what we need from the state
    const {
      pagination: {
        isLoading,
        hasMore,
        originalPath,
      } = {},
    } = store.getState();

    // If we're already loading the next page or if we know that there is no more
    // pages to fetch - then abort
    if (isLoading || !hasMore) {
      debug(`We are done loading. isLoading: ${isLoading}, !hasMore: ${!hasMore}`);
      return Promise.resolve(true);
    }

    // Tell Redux to populate the next part of the config
    return store.dispatch(populateNextPage({
      path: originalPath || location.pathname,
      query: qs.parse(location.search.slice(1)),
    }))


    // Handle application features on subsequent updates
    // NOTE: Depends on the config meta flags (features toggles)
    //
    // Could be things like:
    // - Dynamic pagination
    // - Scroll position memory
      .then(() => {
      // Get the entire redux state
        const currentState = store.getState();

        // Handle features that are behind flags, such as
        // - Back position memory
        // - State caching
        // - Versioning
        featureFlags.enablePagination && updatePaginationQuery();
        featureFlags.enableScrollPositionMemory && history.replaceState(currentState, null);
        featureFlags.enableVersioning && updateVersionQuery();
        return null;
      });
  };

  // Handle the rendering flow
  Promise.resolve()
  // Perform the initial rendering (Will resolve when the actual rendering is done)
    .then(() => renderApp())

  // Handle rendering stuff from cache (Back button memory)
    .then(() => {
    // Pull out history state
      const cacheState = history.state || {};

      // Pull out the modules list of the current config from redux state
      const { config: {
        app: {
          options: {
            modules = [],
          } = {},
        } = {},
      } = {} } = store.getState() || {};

      // Check if the current config has any modules
      const currentConfigHasModules = !!modules.length;

      // Figure out if you should replace the config
      // - If there is a pagination query
      // - (and) If there is no modules in the current config
      const shouldReplaceState = hasPaginationQuery && !currentConfigHasModules;

      // Dispatch an action that replaces the current config with the one in cache
      return shouldReplaceState ? (
        store.dispatch(replaceState(cacheState))
      ) : (
        Promise.resolve()
      );
    })
  /*
  TODO:
  Q:  Det er en promisechain hvor du skriver at du kaller `renderApp()` for å være sikker på at den er rendret 1 gang. Men hele promise chainen starer med nettopp et kall til ????`renderApp()`. Er dette bevist?
  A: . Ja - fordi den helt første renderinga kan være uten moduler (fordi det ikke kommer noen moduler fra serveren om du enabler back-funksjonalitet), deretter lastes moduler fra cache, deretter rendres det på nytt i linje 289
  FOLLOW UP:  Burde ikke  dette kunne gjøres av det som i dag ligger i scrollliseneren  hvis vi bytter den fra å være en scroll lisner, til å bare sjekke om det er 1000 px igjen til kanten. Det er flere tilfeler vi har hvor vi skulle rendra mer, men kommer i en state hvor vi ikke har gjort det.
  */
  /*
  // Make sure we render the app fully at least once before we do the scrolling (restore position)
  .then(() => renderApp())
  */

  // Handle route features on first render
  // NOTE: Depends on the config meta flags (features toggles)
  //
  // Could be things like:
  // - Scroll position memory
    .then(() => {
    // Scroll to the previous location if returning from an outbound visit (back-button)
      featureFlags.enableScrollPositionMemory && handleScrollPosition(originalLocation);
      return null;
    })

  // Handle edge cases where we have no config
  // available after loading the page
    .then(() => {
    // Pull out the modules list of the current config from redux state
      const { config: {
        app: {
          options: {
            modules = [],
          } = {},
        } = {},
      } = {} } = store.getState() || {};

      // Check if the current config has any modules
      const currentConfigHasModules = !!modules.length;

      /*
    If we have no config to render - populate one
    (this happens if you render on client only - like in development)

    If we have a config but no modules to render - populate the next page
    (this happens when you render dynamic configs with geolocation - since that is a client only feature)
    */
      if (!currentConfigHasModules) {
        store.dispatch(refreshConfig({
          path: location.pathname,
          query: qs.parse(location.search.slice(1)),
        }));
      }
      return null;
    })

  // Handle infinite scroll / pagination
    .then(() => {
      infiniteScroll(loadMore);
      return null;
    });
  return null;
}
