/**
 * Dependencies
 */
const React = require('react');
const hoistStatics = require('hoist-non-react-statics');

/**
 * Aurora mixins
 */
const DataMixin = require('../mixins/data-mixin');

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
module.exports = function({
  fetchData = (() => Promise.resolve),
  dataProp = 'data',
  loadingProp = 'isLoading',
  disableServerLoading = false,
}) {
  return function(Component) {
    const withData = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withData',

      /**
       * Add static methods needed
       */
      statics: {
        getData(options) {
          /**
           * The options object will have
           * user defined settings (from getUserSettings)
           * available as options.__settings
           */
          if (disableServerLoading && typeof window === 'undefined') {
            return Promise.resolve();
          } else {
            return fetchData(options);
          }
        },
      },

      /**
       * Add applicable mixins
       */
      mixins: [
        DataMixin('__data'),
      ],

      /**
       * Render the component
       */
      render() {
        const data = {
          [dataProp]: this.state.__data,
          [loadingProp]: !this.state.__data
        };

        return (
          <Component
            {...this.props}
            {...data}
          />
        );
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return hoistStatics(withData, Component);
  };
};