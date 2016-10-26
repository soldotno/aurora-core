'use strict';

/**
 * A utility function for generating
 * Aurora module config resolvers
 *
 * NOTE: Read resolving.md
 */
module.exports = function generateResolvers() {
  var initialPath = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var module = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var createResolver = arguments.length <= 2 || arguments[2] === undefined ? function () {
    return console.log('no function for creating a resolver supplied');
  } : arguments[2];

  /**
   * Create an initial array that will
   * hold our resolver specifications
   */
  var resolvers = [];

  /**
   * Create a function that recursively
   * generates resolver specifications
   * (specific to Aurora configs and the convention of options.modules[..])
   */
  function generateResolversRecursively() {
    var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var module = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    /**
     * Create a resolver for the current level
     */
    resolvers.push(createResolver({ path: path, module: module }));

    /**
     * Recurse deeper if applicable
     */
    if (module.options && Array.isArray(module.options.modules)) {
      module.options.modules.forEach(function (module, i) {
        if (module) {
          var nextPath = path + '.options.modules[' + i + ']';
          generateResolversRecursively(nextPath, module);
        }
      });
    }
  }

  /**
   * Generate the array of resolver specifications
   * (mutates the array 'resolvers')
   */
  generateResolversRecursively(initialPath, module);

  /**
   * Return the array filled with resolver specifications
   */
  return resolvers;
};