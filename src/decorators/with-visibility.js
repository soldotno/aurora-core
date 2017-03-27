// Dependencies
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import sortedObject from 'sorted-object';
import serialize from 'serialize-javascript';

// Utils
import getDisplayName from '../utils/get-display-name';

// Export a decorator that handles conditional visibility in the Aurora frontend
module.exports = function(Component) {
  const withVisibility = React.createClass({
    // Add a specific display name
    displayName: `${getDisplayName(Component)}WithVisibility`,

    // Our component will make use of some internal props, which we prefix with _
    // This signals that they should be left alone by anything else
    propTypes: {
      _hideOnServer: React.PropTypes.bool,
      _hideOnClient: React.PropTypes.bool
    },

    // Set appropriate defaults
    getDefaultProps() {
      return {
        _hideOnServer: true,
        _hideOnClient: false
      };
    },

    // Set the initial state of visibility to what we got from the server config
    // All modules that have a visibility flag in the config will have 'hideOnServer' = false
    getInitialState() {
      return {
        isVisible: !this.props._hideOnServer
      };
    },

    shouldComponentUpdate(nextProps, nextState) {
      // const nextPropsAdjusted =  serialize(sortedObject(nextProps));
      // const thisPropsAdjusted = serialize(sortedObject(this.props));
      const nextStateAdjusted =  serialize(sortedObject(nextState));
      const thisStateAdjusted = serialize(sortedObject(this.state));
      return !(nextStateAdjusted === thisStateAdjusted && serialize(sortedObject(nextProps)) ===  serialize(sortedObject(this.props)));
    },

    // Handle updates with new props
    componentWillReceiveProps(nextProps) {
      this.setState({
        isVisible: !nextProps._hideOnClient
      });
    },

    // A method for handling the visibility on the client (in the browser)
    _handleVisibility() {
      // Update the state to the visibility for this specific platform
      // (already resolved before injecting the config)
      this.setState({
        isVisible: !this.props._hideOnClient
      });
    },

    componentDidMount() {
      // Handle the visibility filtering when mounted
      this._handleVisibility();
    },

    render() {
      // Handle conditional visibility
      const { isVisible } = this.state;

      // Render either the component that is wrapped or nothing
      return isVisible ? <Component {...this.props} /> : null;
    }
  });

  // Return a decorated component with all the existing static methods hoisted
  return hoistStatics(withVisibility, Component);
};
