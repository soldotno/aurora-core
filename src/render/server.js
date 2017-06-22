// Dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import createDebug from 'debug';
import delay from 'delay';
import url from 'url';
import util from 'util';

// Utilities
import removeFalsyKeysFromObject from '../utils/remove-falsy-keys-from-object';
import isUndefined from '../utils/is-undefined';
import extractStyles from '../utils/extract-styles';
import createResolveModules from '../utils/resolve-modules';
import createResolveData from '../utils/resolve-data';
import createResolveVisibility from '../utils/resolve-visibility';

// Components
import ContextWrapper from '../components/ContextWrapper';

// Import webpack bundle hash (generated on build)
// (see webpack.config.js and webpack-output-hash-as-module-plugin.js)
import hash from '../../bundle-hash';

// Initialisations
const debug = createDebug('aurora-core:server-render');

// Render the application on the server
export default function renderServer({
  cacheHTML = {
    get: () => Promise.reject('No cacheHTML.get method supplied to constructor'),
    set: () => console.warn('No cacheHTML.set method supplied to constructor, skipping cache creation'),
    addNonCachableHTML: () => console.warn('No cacheHTML.addNonCachableHTML supplied to constructor, no non-cached html will be appened.'),
  },
  createHTML = () => console.warn('No createHtml() method supplied to constructor'),
  getRoute = () => console.warn('No getRoute() method supplied to constructor'),
  getModule = () => console.warn('No getModule() method supplied to constructor'),
  getUserSettings = () => console.warn('No getUserSettings() method supplied to constructor'),
  getPaginationSettings = () => console.warn('No getPaginationSettings() method supplied to constructor'),
  isVisible = () => console.warn('No isVisible() method supplied to constructor'),
  enableHtmlServerRender = false,
  enableCssServerRender = false,
}) {
  // Initialise utilities with modules from application
  const resolveModules = createResolveModules(getModule);
  const resolveData = createResolveData(getModule);
  const resolveVisibility = createResolveVisibility(isVisible);

  // Return an express route handler to render the server
  return function renderServer(req, res, next) {
    const settings = {
      ...getUserSettings(req, res),
    };

    // @TODO These don't seem to be in use. Figure out the intention! ~misund, 2017-05-02
    const paginationQuery = removeFalsyKeysFromObject({
      page: !isUndefined(req.query.page) ? +req.query.page : null,
      perPage: !isUndefined(req.query.perPage) ? +req.query.perPage : null,
      initialLimit: !isUndefined(req.query.initialLimit) ? +req.query.initialLimit : null,
      hasMore: !isUndefined(req.query.hasMore) ? +req.query.hasMore : null,
    });

    const paginationKey = JSON.stringify(paginationQuery);
    const settingsKey = JSON.stringify(settings);

    req.aurora = {};
    req.aurora.settings = settings;

    return cacheHTML.get(req)
      .then(html => res.send(html))
      .catch(err => renderServerInternal(req, res, next));
  };

  function renderServerInternal(req, res, next) {
    // Extract the pagination data from the query
    const paginationQuery = removeFalsyKeysFromObject({
      page: !isUndefined(req.query.page) ? +req.query.page : null,
      perPage: !isUndefined(req.query.perPage) ? +req.query.perPage : null,
      initialLimit: !isUndefined(req.query.initialLimit) ? +req.query.initialLimit : null,
      hasMore: !isUndefined(req.query.hasMore) ? +req.query.hasMore : null,
    });

    // Extract the version requested from the query
    const requestedVersion = req.query.version || '';

    // Fetch the latest config version number for the requested route
    //
    // NOTE: We're going to use this to compare the latest
    // version to the version requested, so that we can supply
    // a flag that tells the client if there is a newer version
    // of the config for the requested route available
    const latestVersion = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      limit: 0,
      settings, // eslint-disable-line no-use-before-define
    })
      .then(({ meta: { version } = {} } = {}) => version)
    ;

    // Create a flag telling you if the request has a pagination query
    const hasPaginationQuery = !!Object.keys(paginationQuery).length;

    // Create initial pagination settings
    // (set the initial amount of modules to load on the server)
    const pagination = {
      page: 0,
      hasMore: true,
      isLoading: false,
      originalPath: req.path,
      perPage: 10,
      initialLimit: 10,
      ...getPaginationSettings(req, res),
      ...paginationQuery,
    };

    // Get user defined settings
    const settings = {
      ...getUserSettings(req, res),
    };

    // Fetch the initial route config from the supplied getRoute method
    const config = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      query: req.query,
      limit: hasPaginationQuery ? 0 : (pagination.page * pagination.perPage) + pagination.initialLimit,
      page: hasPaginationQuery ? 0 : pagination.page,
      version: requestedVersion,
      settings,
      configStatusCode, // eslint-disable-line no-use-before-define
    });

    // Pull out the config meta-data
    //
    // Contains things like:
    // - version (for this config/route)
    // - flags (for this config/route)
    // - etc..
    const configMeta = config
    .then(({ meta }) => meta);

    const configStatusCode = config
    .then(({ status }) => status);

    // Create a config with the visibility resolved
    const configWithVisibilityResolved = config
      .then(({ data: { config } }) => config)
      .then(resolveVisibility.onServer)
    ;

    // Create a config with the data resolved.
    //
    // NOTE: We only do this if server rendering and data
    // loading is enabled - if not we just short circuit this step
    const configWithDataResolved = enableHtmlServerRender ? (
      configWithVisibilityResolved.then(config => Promise.race([
        delay(2000).then(() => config),
        resolveData(settings, config),
      ]))
    ) : (
      configWithVisibilityResolved
    );

    // Create a config with the modules / React components resolved
    const configWithModulesResolved = configWithDataResolved
      .then(resolveModules)
    ;

    // Collect and pass all of our data to the function that creates
    // the initial markup and serves it to the client
    Promise.all([
      latestVersion,
      configMeta,
      configWithDataResolved,
      configWithModulesResolved,
      configStatusCode,
    ])
      .then(([
        latestVersion,
        { version, flags } = {},
        config,
        { app, app: { options = {}, type: App } } = {},
        statusCode,
      ]) => { // eslint-disable-line consistent-return
        if (statusCode === 404) {
          return next();
        }
        const assembledApp = (
          <ContextWrapper
            actions={{}}
            settings={settings}
          >
            <App
              newVersionAvailable={latestVersion !== version}
              pagination={pagination}
              {...options}
            />
          </ContextWrapper>
        );

        // Render app to string, and collect styled-components styles
        const sheet = new ServerStyleSheet();
        const appMarkup = renderToString(sheet.collectStyles(assembledApp));
        const styledComponentsStyleTags = sheet.getStyleTags();

        // Old aurora styles-loader
        const criticalStyles = enableCssServerRender ? extractStyles(app) : '';

        // Create the actual HTML that we'll serve
        let markup = createHTML({
          appMarkup,
          config,
          pagination,
          settings,
          version,
          latestVersion,
          flags,
          hash,
          criticalStyles,
          styledComponentsStyleTags,
        });

        // Set HTML cache.
        cacheHTML.set(req, markup);

        // Add non-cachable HTML if provided.
        if (typeof cacheHTML.addNonCachableHTML === 'function') {
          markup = cacheHTML.addNonCachableHTML(markup, settings);
        }

        // Return the created markup
        res.send(markup);
      })

      // Catch any errors
      .catch((err) => { // eslint-disable-line consistent-return
        // Log the error output
        debug(util.inspect(err, { colors: true }));
        debug(err.stack);

        // If no config was found (404), skip to the next route handler
        if (err.status === 404) {
          return next();
        }

        // Return the error message as a response otherwise
        res.status(500).send(err.message);
      })
    ;
  }
}
