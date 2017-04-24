const PropTypes = require('prop-types');
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
module.exports = function renderChildrenMixin() {
  return {
    propTypes: {
      modules: PropTypes.array, // eslint-disable-line react/forbid-prop-types
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
      const {
        modules,
      } = this.props;

      /**
       * This is the higher order part
       * (just copy/paste this basically)
       */
      const children = modules.map((module, i) => {
        const Module = module ? module.type : false;

        return Module ?
          (
            <Module
              key={i}
              {...module.options}
            />
          ) :
          null;
      });

      return children;
    },
  };
};
