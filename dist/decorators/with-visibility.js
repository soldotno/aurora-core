'use strict';

/**
 * Dependencies
 */
var React = require('react');
var hoistStatics = require('hoist-non-react-statics');
var sortedObject = require('sorted-object');
var serialize = require('serialize-javascript');

/**
 * Export a decorator that
 * handles conditional visibility
 * in the Aurora frontend
 */
module.exports = function (Component) {
  var withVisibility = React.createClass({
    /**
     * Add a specific display name
     */
    displayName: 'withVisibility',

    /**
     * Our component will make use of
     * some internal props, which we
     * prefix with _ to signal that
     * they should be left alone
     * by anything else
     */
    propTypes: {
      _hideOnServer: React.PropTypes.bool,
      _hideOnClient: React.PropTypes.bool
    },

    /**
     * Set appropriate defaults
     */
    getDefaultProps: function getDefaultProps() {
      return {
        _hideOnServer: false,
        _hideOnClient: false
      };
    },


    /**
     * Set the initial state of
     * visibility to what we got
     * from the server config
     *
     * All modules that have
     * a visibility flag in the
     * config will have 'hideOnServer' = false
     */
    getInitialState: function getInitialState() {
      return {
        isVisible: !this.props._hideOnServer
      };
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
      var nextPropsAdjusted = serialize(sortedObject(nextProps));
      var thisPropsAdjusted = serialize(sortedObject(this.props));

      var nextStateAdjusted = serialize(sortedObject(nextState));
      var thisStateAdjusted = serialize(sortedObject(this.state));

      var shouldUpdate = !(nextPropsAdjusted === thisPropsAdjusted && nextStateAdjusted === thisStateAdjusted);
      if (shouldUpdate) {
        console.log('Component.shouldUpdate: (newprops, oldprops)', nextPropsAdjusted, thisPropsAdjusted);
      } else {
        console.log('Component should not update');
        //console.log('Component.should not Update: (newprops, oldprops, nextState, thisState)', nextPropsAdjusted, thisPropsAdjusted, nextStateAdjusted, thisStateAdjusted);
      }
      return shouldUpdate;
    },


    /**
     * Handle updates with new props
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.setState({
        isVisible: !nextProps._hideOnClient
      });
    },


    /**
     * A method for handling
     * the visibility on the client
     * (in the browser)
     */
    _handleVisibility: function _handleVisibility() {
      /**
       * Update the state to
       * the visibility for this
       * specific platform
       * (already resolved before injecting the config)
       */
      this.setState({
        isVisible: !this.props._hideOnClient
      });
    },
    componentDidMount: function componentDidMount() {
      /**
       * Handle the visibility
       * filtering when mounted
       */
      this._handleVisibility();
    },
    render: function render() {
      /**
       * Handle conditional visibility
       */
      var isVisible = this.state.isVisible;

      /**
       * Render either the component
       * that is wrapped or nothing
       */

      return isVisible ? React.createElement(Component, this.props) : null;
    }
  });

  /**
   * Return a decorated component
   * with all the existing static
   * methods hoisted
   */
  return hoistStatics(withVisibility, Component);
};