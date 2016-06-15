'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Dependencies
 */
var debug = require('debug')('aurora-core:server-render');
var util = require('util');
var React = require('react'); // eslint-disable-line no-unused-vars
var ReactDOMServer = require('react-dom/server');
var delay = require('delay');
var url = require('url');

/**
 * Utilities
 */
var removeFalsyKeysFromObject = require('../utils/remove-falsy-keys-from-object');
var isUndefined = require('../utils/is-undefined');

/**
 * Components
 */
var ContextWrapper = require('../components/ContextWrapper');

/**
 * Import webpack bundle hash (generated on build)
 * (see webpack.config.js and webpack-output-hash-as-module-plugin.js)
 */
var hash = require('../../bundle-hash');

/**
 * Render the application
 * on the server
 */
module.exports = function (_ref) {
  var _ref$createHTML = _ref.createHTML;
  var createHTML = _ref$createHTML === undefined ? function () {
    return console.warn('No createHtml() method supplied to constructor');
  } : _ref$createHTML;
  var _ref$getRoute = _ref.getRoute;
  var getRoute = _ref$getRoute === undefined ? function () {
    return console.warn('No getRoute() method supplied to constructor');
  } : _ref$getRoute;
  var _ref$getModule = _ref.getModule;
  var getModule = _ref$getModule === undefined ? function () {
    return console.warn('No getModule() method supplied to constructor');
  } : _ref$getModule;
  var _ref$getUserSettings = _ref.getUserSettings;
  var getUserSettings = _ref$getUserSettings === undefined ? function () {
    return console.warn('No getUserSettings() method supplied to constructor');
  } : _ref$getUserSettings;
  var _ref$getPaginationSet = _ref.getPaginationSettings;
  var getPaginationSettings = _ref$getPaginationSet === undefined ? function () {
    return console.warn('No getPaginationSettings() method supplied to constructor');
  } : _ref$getPaginationSet;
  var _ref$isVisible = _ref.isVisible;
  var isVisible = _ref$isVisible === undefined ? function () {
    return console.warn('No isVisible() method supplied to constructor');
  } : _ref$isVisible;

  /**
   * Utilities
   */
  var extractStyles = require('../utils/extract-styles');
  var resolveModules = require('../utils/resolve-modules')(getModule);
  var resolveData = require('../utils/resolve-data')(getModule);
  var resolveVisibility = require('../utils/resolve-visibility')(isVisible);

  /**
   * Return an express route handler to render the server
   */
  return function renderServer(req, res, next) {
    /**
     * Extract the pagination data from the query
     */
    var paginationQuery = removeFalsyKeysFromObject({
      page: !isUndefined(req.query.page) ? +req.query.page : null,
      perPage: !isUndefined(req.query.perPage) ? +req.query.perPage : null,
      initialLimit: !isUndefined(req.query.initialLimit) ? +req.query.initialLimit : null,
      hasMore: !isUndefined(req.query.hasMore) ? +req.query.hasMore : null
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
    var requestedVersion = req.query.version || '';

    /**
     * Fetch the latest config version number for the requested route
     */
    var latestVersion = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      limit: 0,
      settings: settings
    }).then(function () {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$meta = _ref2.meta;
      _ref2$meta = _ref2$meta === undefined ? {} : _ref2$meta;
      var version = _ref2$meta.version;
      return version;
    });

    /**
     * Create a flag telling you if the request has a pagination query
     */
    var hasPaginationQuery = !!Object.keys(paginationQuery).length;

    /**
     * Create initial pagination settings
     * (set the initial amount of modules to load on the server)
     */
    var pagination = _extends({
      page: 0,
      hasMore: true,
      isLoading: false,
      originalPath: req.path,
      perPage: 10,
      initialLimit: 10
    }, getPaginationSettings(req, res), paginationQuery);

    /**
     * Get user defined settings
     */
    var settings = _extends({}, getUserSettings(req, res));

    /**
     * Fetch the initial route config
     * from the supplied getRoute method
     */
    var config = getRoute({
      path: (url.parse(req.originalUrl) || {}).pathname,
      query: req.query,
      limit: hasPaginationQuery ? 0 : pagination.page * pagination.perPage + pagination.initialLimit,
      page: hasPaginationQuery ? 0 : pagination.page,
      version: requestedVersion,
      settings: settings
    });

    /**
     * Pull out the config meta-data
     *
     * Contains things like:
     * - version (for this config/route)
     * - flags (for this config/route)
     * - etc..
     */
    var configMeta = config.then(function (_ref3) {
      var meta = _ref3.meta;
      return meta;
    });

    /**
     * Create a config with the visibility resolved
     */
    var configWithVisibilityResolved = config.then(function (_ref4) {
      var config = _ref4.data.config;
      return config;
    }).then(resolveVisibility.onServer);

    /**
     * Create a config with the data resolved.
     */
    var configWithDataResolved = configWithVisibilityResolved.then(function (config) {
      return Promise.race([delay(2000).then(function () {
        return config;
      }), resolveData(settings, config)]);
    });

    /**
     * Create a config with the modules / React components resolved
     */
    var configWithModulesResolved = configWithDataResolved.then(resolveModules);

    /**
     * Collect and pass all of our data
     * to the function that creates
     * the initial markup and serves it to the client
     */
    Promise.all([latestVersion, configMeta, configWithDataResolved, configWithModulesResolved]).then(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 4);

      var latestVersion = _ref6[0];
      var _ref6$ = _ref6[1];
      _ref6$ = _ref6$ === undefined ? {} : _ref6$;
      var version = _ref6$.version;
      var flags = _ref6$.flags;
      var config = _ref6[2];
      var _ref6$2 = _ref6[3];
      _ref6$2 = _ref6$2 === undefined ? {} : _ref6$2;
      var app = _ref6$2.app;
      var _ref6$2$app = _ref6$2.app;
      var _ref6$2$app$options = _ref6$2$app.options;
      var options = _ref6$2$app$options === undefined ? {} : _ref6$2$app$options;
      var App = _ref6$2$app.type;

      /**
       * Render the app as
       * as markup string
       */
      var appMarkup = ReactDOMServer.renderToString(React.createElement(
        ContextWrapper,
        {
          actions: {},
          settings: settings
        },
        React.createElement(App, _extends({
          newVersionAvailable: latestVersion !== version,
          pagination: pagination
        }, options))
      ));

      /**
       * Pull out all critical styles
       */
      var criticalStyles = extractStyles(app);

      /**
       * Create the actual HTML
       * that we'll return to
       * the client
       */
      var markup = createHTML({
        appMarkup: appMarkup,
        config: config,
        pagination: pagination,
        settings: settings,
        version: version,
        latestVersion: latestVersion,
        flags: flags,
        hash: hash,
        criticalStyles: criticalStyles
      });

      /**
       * Return the created markup
       */
      res.send(markup);
    })
    /**
     * Catch any errors
     */
    .catch(function (err) {
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