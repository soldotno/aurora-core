// Dependencies
import React from 'react';
import sassLoader from 'aurora-sass-loader';
import hoistStatics from 'hoist-non-react-statics';

// Aurora mixins
import StyleInjectMixin from '../mixins/style-inject-mixin';
import getDisplayName from '../utils/get-display-name';


// Export a decorator that handles style injection and extraction in the Aurora frontend
module.exports = function({ serverPath, clientStyles }) {
  ///Load the styles for server rendering with the Aurora Sass loader
  const serverStyles = sassLoader(serverPath);

  // Return a function that produces a higher order component that includes styling
  return function(Component) {
    const withStyles = React.createClass({
      // Add a specific display name
      displayName: `${getDisplayName(Component)}WithStyles`,

      // Add static methods needed
      statics: {
        getStyles() {
          return serverStyles;
        },
      },

      // Mixins
      mixins: [
        StyleInjectMixin(clientStyles),
      ],

      // Render the component
      render() {
        return (
          <Component {...this.props} />
        );
      }
    });

    // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(withStyles, Component);
  };
};
