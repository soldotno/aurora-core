/**
 * Dependencies
 */
const debug = require('debug')('aurora-core:server-render');
const util = require('util');
const React = require('react'); // eslint-disable-line no-unused-vars
const ReactDOMServer = require('react-dom/server');
const delay = require('delay');
const url = require('url');

/**
 * Utilities
 */
const removeFalsyKeysFromObject = require('../utils/remove-falsy-keys-from-object');
const isUndefined = require('../utils/is-undefined');

/**
 * Components
 */
const ContextWrapper = require('../components/ContextWrapper');

/**
 * Import webpack bundle hash (generated on build)
 * (see webpack.config.js and webpack-output-hash-as-module-plugin.js)
 */
const hash = require('../../bundle-hash');

/**
 * Render the application
 * on the server
 */
module.exports = function ({
  createHTML = () => console.warn('No createHtml() method supplied to constructor'),
  getRoute = () => console.warn('No getRoute() method supplied to constructor'),
  getModule = () => console.warn('No getModule() method supplied to constructor'),
  getUserSettings = () => console.warn('No getUserSettings() method supplied to constructor'),
  getPaginationSettings = () => console.warn('No getPaginationSettings() method supplied to constructor'),
  isVisible = () => console.warn('No isVisible() method supplied to constructor'),
}) {
  /**
   * Utilities
   */
  const extractStyles = require('../utils/extract-styles');
  const resolveModules = require('../utils/resolve-modules')(getModule);
  const resolveData = require('../utils/resolve-data')(getModule);
  const resolveVisibility = require('../utils/resolve-visibility')(isVisible);

  /**
   * Return an express route handler to render the server
   */
  return function renderServer(req, res, next) {
    /**
     * Extract the pagination data from the query
     */
    const paginationQuery = removeFalsyKeysFromObject({
      page: !isUndefined(req.query.page) ? +req.query.page : null,
      perPage: !isUndefined(req.query.perPage) ? +req.query.perPage : null,
      initialLimit: !isUndefined(req.query.initialLimit) ? +req.query.initialLimit : null,
      hasMore: !isUndefined(req.query.hasMore) ? +req.query.hasMore : null,
    });

    /**
     * Extract the version from the query
     *
     * TODO: Add version handling, so you
     * can inform the user that there is
     * a new version available (via the app module)
     *
     * Maybe add two version flags (requestedVersion and latestVersion)
     * so that you can calculate this on both the server and client
     * deterministically
     */
    const requestedVersion = req.query.version || '';

    /**
     * Fetch the latest config version number for the requested route
     */
    const latestVersion = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      limit: 0,
      settings,
    })
    .then(({ meta: { version } = {} } = {}) => version);

    /**
     * Create a flag telling you if the request has a pagination query
     */
    const hasPaginationQuery = !!Object.keys(paginationQuery).length;

    /**
     * Create initial pagination settings
     * (set the initial amount of modules to load on the server)
     */
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

    /**
     * Get user defined settings
     */
    const settings = {
      ...getUserSettings(req, res)
    };

    /**
     * Fetch the initial route config
     * from the supplied getRoute method
     */
    const config = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      query: req.query,
      limit: hasPaginationQuery ? 0 : (pagination.page * pagination.perPage) + pagination.initialLimit,
      page: hasPaginationQuery ? 0 : pagination.page,
      version: requestedVersion,
      settings,
    });

    /**
     * Pull out the config meta-data
     *
     * Contains things like:
     * - version (for this config/route)
     * - flags (for this config/route)
     * - etc..
     */
    const configMeta = config
    .then(({ meta }) => meta);

    /**
     * Create a config with the visibility resolved
     */
    const configWithVisibilityResolved = config
    .then(({ data: { config } }) => config)
    .then(resolveVisibility.onServer);

    /**
     * Create a config with the data resolved.
     */
    const configWithDataResolved = configWithVisibilityResolved
    .then((config) => Promise.race([
      delay(2000).then(() => config),
      resolveData(settings, config),
    ]));

    /**
     * Create a config with the modules / React components resolved
     */
    const configWithModulesResolved = configWithDataResolved
    .then(resolveModules);

    /**
     * Collect and pass all of our data
     * to the function that creates
     * the initial markup and serves it to the client
     */
    Promise.all([
      latestVersion,
      configMeta,
      configWithDataResolved,
      configWithModulesResolved,
    ])
    .then(([
      latestVersion,
      { version, flags } = {},
      config,
      { app, app: { options = {}, type: App } } = {},
    ]) => {
      /**
       * Render the app as
       * as markup string
       */
      const appMarkup = ReactDOMServer.renderToString(
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

      /**
       * Pull out all critical styles
       */
      const criticalStyles = extractStyles(app);

      /**
       * Create the actual HTML
       * that we'll return to
       * the client
       */
      const markup = createHTML({
        appMarkup,
        config,
        pagination,
        settings,
        version,
        latestVersion,
        flags,
        hash,
        criticalStyles,
      });

      /**
       * Return the created markup
       */
      res.send(markup);
    })
    /**
     * Catch any errors
     */
    .catch((err) => {
      /**
       * Log the error output
       */
      debug(util.inspect(err, { colors: true }));
      debug(err.stack);

      /**
       * If no config was found (404)
       * skip to the next route handler
       */
      if (err.status === 404) {
        return next();
      }

      /**
       * Return the error message
       * as a response otherwise
       */
      res.status(500).send(err.message);
    });
  };
};
