/* eslint-disable no-underscore-dangle */
// Dependencies
import React from 'react';
import createReactClass from 'create-react-class';
import hoistStatics from 'hoist-non-react-statics';

// Aurora mixins
import DataMixin from '../mixins/data-mixin';
import getDisplayName from '../utils/get-display-name';

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
module.exports = function withData({
  fetchData = (() => Promise.resolve()),
  dataProp = 'data',
  loadingProp = 'isLoading',
  errorProp = 'error',
  disableServerLoading = false,
}) {
  return function withData(Component) {
    const withData = createReactClass({
      // Add a specific display name
      displayName: `${getDisplayName(Component)}WithData`,

      // Add static methods needed
      statics: {
        getData(options) {
          // The options object will have user defined settings (from getUserSettings) available as options.__settings
          if (disableServerLoading && typeof window === 'undefined') {
            return Promise.resolve();
          }

          return fetchData(options);
        },
      },

      // Add applicable mixins
      mixins: [
        DataMixin('__data', '__error'),
      ],

      // Render the component
      render() {
        const data = {
          [dataProp]: this.state.__data,
          [loadingProp]: !this.state.__data,
          [errorProp]: this.state.__error,
        };

        return (
          <Component
            {...this.props}
            {...data}
            reloadFunction={this._handleData}
          />
        );
      },
    });

    // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(withData, Component);
  };
};
