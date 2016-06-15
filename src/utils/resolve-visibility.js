/**
 * Dependencies
 */
const set = require('lodash.set');
const clone = require('stringify-clone');

/**
 * Utilities
 */
const generateResolvers = require('./generate-resolvers');

/**
 * Export tool for resolving visibility
 */
module.exports = function(
  isVisible = () => console.warn('No isVisible() method supplied to constructor')
) {
  return {
    /**
     * A method for actually resolving a config
     * from type names to React components.
     * Takes a config object to be resolved and
     * an array of paths generated by the
     * function above (generatePaths)
     */
    onClient(
      settings = {},
      query = {},
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
        path = '',
        module = {},
      } = {}) => {
        return {
          path: `${path}.options._hideOnClient`,
          value: !!module.visibility && !isVisible(settings, query, module.visibility)
        };
      });

      /**
       * Return a Promise of the config
       * resolved with visibility settings
       * that we'll use for conditionally
       * showing modules on different sized devices
       */
      return new Promise((resolve) => {
        resolvers.forEach((resolver) => {
          set(configCopy, resolver.path, resolver.value);
        });

        resolve(configCopy);
      });
    },
    /**
     * A method for actually resolving a config
     * from type names to React components.
     * Takes a config object to be resolved and
     * an array of paths generated by the
     * function above (generatePaths)
     */
    onServer(
      config = {}
    ) {
      const configCopy = clone(config);

      /**
       * Create an array of resolver specifications
       */
      const resolvers = generateResolvers('app', configCopy.app, ({
        path = '',
        module = {},
      } = {}) => {
        return {
          path: `${path}.options._hideOnServer`,
          value: !!module.visibility
        };
      });

      /**
       * Return a Promise of the config
       * resolved with visibility
       * (which platform it should be shown on)
       */
      return new Promise((resolve) => {
        resolvers.forEach((resolver) => {
          set(configCopy, resolver.path, resolver.value);
        });

        resolve(configCopy);
      });
    }
  };
};
