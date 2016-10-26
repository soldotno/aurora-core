'use strict';

/**
 * Dependencies
 */
var set = require('lodash.set');
var asyncEach = require('async-each');
var clone = require('stringify-clone');

/**
 * Utilities
 */
var generateResolvers = require('./generate-resolvers');

/**
 * A method for actually resolving the data
 * needs of a config (server-side rendering).
 * Takes a config object to be resolved
 */
module.exports = function () {
  var getModule = arguments.length <= 0 || arguments[0] === undefined ? function () {
    return console.warn('No getModule() method supplied to constructor');
  } : arguments[0];

  return function () {
    var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    /**
     * Clone the config to avoid mutation
     */
    var configCopy = clone(config);

    /**
     * Create an array of resolver specifications
     */
    var resolvers = generateResolvers('app', configCopy.app, function (_ref) {
      var path = _ref.path;
      var _ref$module = _ref.module;
      var _ref$module$type = _ref$module.type;
      var type = _ref$module$type === undefined ? '' : _ref$module$type;
      var _ref$module$options = _ref$module.options;
      var options = _ref$module$options === undefined ? {} : _ref$module$options;

      return {
        path: path + '.options._data',
        getData: function getData() {
          return getModule(type).then(function (_ref2) {
            var _ref2$getData = _ref2.getData;
            var getData = _ref2$getData === undefined ? function () {
              return Promise.resolve();
            } : _ref2$getData;

            return getData(Object.assign({}, { __settings: settings }, options._dataOptions));
          });
        }
      };
    });

    /**
     * Return a Promise of the config
     * resolved with data by applying
     * the resolvers created above
     */
    return new Promise(function (resolve, reject) {
      asyncEach(resolvers, function (_ref3, cb) {
        var path = _ref3.path;
        var _ref3$getData = _ref3.getData;
        var getData = _ref3$getData === undefined ? function () {
          return Promise.resolve();
        } : _ref3$getData;

        getData().then(function (_data) {
          set(configCopy, path, _data);
          cb();
        }).catch(cb);
      }, function (err) {
        return err ? reject(err) : resolve(configCopy);
      });
    });
  };
};