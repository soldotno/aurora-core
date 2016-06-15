/**
 * A utility function for generating
 * Aurora module config resolvers
 *
 * NOTE: Read resolving.md
 */
module.exports = function generateResolvers(
  initialPath = '',
  module = {},
  createResolver = () => console.log('no function for creating a resolver supplied')
) {
  /**
   * Create an initial array that will
   * hold our resolver specifications
   */
  const resolvers = [];

  /**
   * Create a function that recursively
   * generates resolver specifications
   * (specific to Aurora configs and the convention of options.modules[..])
   */
  function generateResolversRecursively(path = '', module = {}) {
    /**
     * Create a resolver for the current level
     */
    resolvers.push(createResolver({ path, module }));

    /**
     * Recurse deeper if applicable
     */
    if (module.options && Array.isArray(module.options.modules)) {
      module.options.modules.forEach((module, i) => {
        const nextPath = `${path}.options.modules[${i}]`;
        generateResolversRecursively(nextPath, module);
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
