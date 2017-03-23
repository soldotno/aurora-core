// Dependencies
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

// Aurora mixins
import ScriptInjectMixin from '../mixins/script-inject-mixin';
import getDisplayName from '../utils/get-display-name';

// Higher order component factory for adding Aurora script injection
module.exports = function({ scripts }) {
  return function(Component) {
    const withScripts = React.createClass({
      // Add a specific display name
      displayName: `${getDisplayName(Component)}WithScripts`,

      // Mixins
      mixins: [
        ScriptInjectMixin(scripts),
      ],

      // Render the component
      render() {
        return (
          <Component {...this.props} />
        );
      }
    });

     // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(withScripts, Component);
  };
};
