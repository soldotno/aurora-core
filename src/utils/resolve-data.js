/* eslint-disable no-underscore-dangle */
// Dependencies
const set = require('lodash.set');
const asyncEach = require('async-each');
const clone = require('stringify-clone');

// Utilities
const generateResolvers = require('./generate-resolvers');

/**
 * A method for actually resolving the data
 * needs of a config (server-side rendering).
 * Takes a config object to be resolved
 */
module.exports = function resolveData(
  getModule = () => console.warn('No getModule() method supplied to constructor')
) {
  return function resolveData(
    settings = {},
    config = {}
  ) {
    /**
     * Clone the config to avoid mutation
     */
    const configCopy = clone(config);

    /**
     * Create an array of resolver specifications
     */
    const resolvers = generateResolvers('app', configCopy.app, ({
      path,
      module: {
        type = '',
        options = {},
      },
    }) => {
      return {
        path: `${path}.options._data`,
        getData: (() => {
          return getModule(type)
          .then(({ getData = () => Promise.resolve() }) => {
            return getData(Object.assign({}, { __settings: settings }, options._dataOptions));
          });
        }),
      };
    });

    /**
     * Return a Promise of the config
     * resolved with data by applying
     * the resolvers created above
     */
    return new Promise((resolve, reject) => {
      asyncEach(resolvers, ({
        path,
        getData = () => Promise.resolve(),
      }, cb) => {
        getData()
        .then((_data) => {
          set(configCopy, path, _data);
          cb();
        })
        .catch(cb);
      }, (err) => {
        return err ? reject(err) : resolve(configCopy);
      });
    });
  };
};
