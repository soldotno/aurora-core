'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Dependencies
 */
var React = require('react');

/**
 * Export a helper mixin that
 * exposes an instance method
 * to easily render nested modules
 * in a higher order module
 */
module.exports = function () {
  return {
    propTypes: {
      modules: React.PropTypes.array
    },

    getDefaultProps: function getDefaultProps() {
      return {
        modules: []
      };
    },


    /**
     * Instance method exposed as
     * a convenience when rendering
     * nested modules
     */
    renderChildren: function renderChildren() {
      var modules = this.props.modules;

      /**
       * This is the higher order part
       * (just copy/paste this basically)
       */

      var children = modules.map(function (module, i) {
        var Module = module ? module.type : false;

        return Module ? React.createElement(Module, _extends({
          key: i
        }, module.options)) : null;
      });

      return children;
    }
  };
};