const PropTypes = require('prop-types');
/**
 * Dependencies
 */
const React = require('react');

/**
 * Aurora module React component
 */
class ContextWrapper extends React.Component {
 /**
  * Declare the proptypes we accept
  */
  static propTypes = {
    actions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    settings: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    children: PropTypes.element.isRequired,
  };

 /**
  * Declare the context types we accept being set
  */
  static childContextTypes = {
    actions: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

 /**
  * Set the context using props
  */
  getChildContext() {
    const { children, ...props } = this.props;
    return { ...props };
  }

 /**
  * Render the children (which in our case will be the App)
  */
  render() {
    const { children } = this.props;
    return children;
  }
}

/**
 * Export component
 */
module.exports = ContextWrapper;
