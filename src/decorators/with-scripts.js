// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import hoistStatics from 'hoist-non-react-statics';
import isClient from 'is-client';

// Utilities
import getDisplayName from '../utils/get-display-name';

const isBrowser = isClient();

// Higher order component factory for adding Aurora script injection
export default function getWithScriptsDecorator({ scripts }) {
  return function withScriptsDecorator(Component) {
    const withScripts = createReactClass({
      // Add a specific display name
      displayName: `${getDisplayName(Component)}WithScripts`,

      // Pull out the settings from context
      contextTypes: {
        actions: PropTypes.object,
        settings: PropTypes.object,
        experiments: PropTypes.object,
      },

      /**
       * This is the code used for
       * dynamically injection scripts
       * when the page is loaded on
       * the client
       */
      componentWillMount() {
        if (isBrowser) {
          scripts(this.context);
        }
      },

      // Render the component
      render() {
        return (
          <Component {...this.props} />
        );
      },
    });

     // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(withScripts, Component);
  };
}
