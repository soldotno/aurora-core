const PropTypes = require('prop-types');
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
    actions: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  },

  /**
   * Declare the context types we accept being set
   */
  childContextTypes: {
    actions: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
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
