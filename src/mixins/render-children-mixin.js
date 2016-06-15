/**
 * Dependencies
 */
const React = require('react');

/**
 * Export a helper mixin that
 * exposes an instance method
 * to easily render nested modules
 * in a higher order module
 */
module.exports = function() {
  return {
    propTypes: {
      modules: React.PropTypes.array,
    },

    getDefaultProps() {
      return {
        modules: [],
      };
    },

    /**
     * Instance method exposed as
     * a convenience when rendering
     * nested modules
     */
    renderChildren() {
      let {
        modules,
      } = this.props;

      /**
       * This is the higher order part
       * (just copy/paste this basically)
       */
      let children = modules.map((module, i) => {
        let Module = module.type;

        return (
          <Module
            key={i}
            {...module.options}
          />
        );
      });

      return children;
    }
  };
};
