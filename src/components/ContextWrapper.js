/**
 * Dependencies
 */
const React = require('react');

/**
 * Aurora module React component
 */
const ContextWrapper = React.createClass({
  /**
   * Declare the proptypes we accept
   */
  propTypes: {
    actions: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },

  /**
   * Declare the context types we accept being set
   */
  childContextTypes: {
    actions: React.PropTypes.object.isRequired,
    settings: React.PropTypes.object.isRequired,
  },

  /**
   * Set the context using props
   */
  getChildContext() {
    const { children, ...props } = this.props;
    return { ...props };
  },

  /**
   * Render the children (which in our case will be the App)
   */
  render() {
    const { children } = this.props;
    return children;
  }
});

/**
 * Export component
 */
module.exports = ContextWrapper;
