/* global __DEVELOPMENT__ */

// Dependencies
import React from 'react';
import sassLoader from 'aurora-sass-loader';
import hoistStatics from 'hoist-non-react-statics';
import isClient from 'is-client';
import injectStyles from 'style-loader/addStyles';

import getDisplayName from '../utils/get-display-name';

const isBrowser = isClient();

// Export a decorator that handles style injection and extraction in the Aurora frontend
export default function getWithStylesDecorator({ serverPath, clientStyles }) {
  // Load the styles for server rendering with the Aurora Sass loader
  const serverStyles = sassLoader(serverPath);

  // Return a function that produces a higher order component that includes styling
  return function withStylesDecorator(Component) {
    class WithStyles extends React.Component {
      // Add a specific display name
      static displayName = `${getDisplayName(Component)}WithStyles`;

      // Add static methods needed
      static getStyles() {
        return serverStyles;
      }

      componentWillMount() {
        if (isBrowser && !__DEVELOPMENT__) {
          injectStyles(clientStyles);
        }
      }

      // Render the component
      render() {
        return (
          <Component {...this.props} />
        );
      }
    }

    // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(WithStyles, Component);
  };
}
