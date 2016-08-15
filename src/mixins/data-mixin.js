/**
 * Dependencies
 */
const React = require('react');

/**
 * Export a mixin that handles
 * data fetching on both the client
 * and server for Aurora modules
 */
module.exports = function(stateName, errorName) {
  return {
    /**
     * These are the props
     * that will be supplied
     * by the config
     */
    propTypes: {
      _dataOptions: React.PropTypes.object,
      _data: React.PropTypes.object
    },

    /**
     * These are the context
     * that will be supplied by
     * the top renderer
     */
    contextTypes: {
      settings: React.PropTypes.object,
    },

    /**
     * Set some appropriate
     * default props
     */
    getDefaultProps() {
      return {
        _dataOptions: {},
        _data: null
      };
    },

    /**
     * Set the initial data
     * state to what we got from
     * props (might have been loaded server-side)
     */
    getInitialState() {
      return {
        [stateName]: this.props._data,
        [errorName]: false,
      };
    },

    /**
     * Handle updates with new props
     */
    componentWillReceiveProps(nextProps) {
      const {
        _hideOnClient = false
      } = this.props;

      !this.state[stateName] && this.setState({
        [stateName]: nextProps._data
      }, () => {
        !_hideOnClient && this._handleData();
      });
    },

    /**
     * General instance method
     * for handling data loading
     */
    _handleData() {
      /**
       * Pull out what we need from props
       */
      const {
        _data,
        _dataOptions = {},
      } = this.props;

      /**
       * Pull out what we need from context
       */
      const {
        settings = {},
      } = this.context;

      /**
       * Pull the 'getData' method
       * that all modules which need
       * data fetching must implement
       */
      const {
        getData = (() => Promise.resolve({ crap: 5 }))
      } = this.constructor;

      /**
       * Check if data was loaded server-side.
       * If not - we fetch the data client-side
       * and update the state
       *
       * We'll also add add the global settings to
       * the request implicitely
       */
      if (!_data) {
        getData(Object.assign({}, { __settings: settings }, _dataOptions))
        .then((_data) => this.setState({ [stateName]: _data }))
        .catch((_data) => this.setState({ [errorName]: _data }));
      }
    },

    componentDidMount() {
      /**
       * We'll assume the component is using
       * aurora-visibility-mixin, if not
       * we'll default to performing the handling
       */
      const {
        _hideOnClient = false
      } = this.props;

      /**
       * Only do data handling if the
       * component will be visible on the client
       *
       * We'll assume the component is using
       * aurora-visibility-mixin, if not
       * we'll default to performing the handling
       */
      !_hideOnClient && this._handleData();
    }
  };
};
