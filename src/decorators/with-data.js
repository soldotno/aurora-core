/* eslint-disable no-underscore-dangle, no-useless-computed-key, dot-notation */
// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

import getDisplayName from '../utils/get-display-name';

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
export default function getWithDataDecorator({
  fetchData = (() => Promise.resolve()),
  dataProp = 'data',
  loadingProp = 'isLoading',
  errorProp = 'error',
  disableServerLoading = false,
}) {
  return function withDataDecorator(Component) {
    class WithData extends React.Component {
      // Add a specific display name
      static displayName = `${getDisplayName(Component)}WithData`;

      // These are the props that will be supplied by the config
      static propTypes = {
        _dataOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        _data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        _hideOnClient: PropTypes.bool,
      };

      // These are the context that will be supplied by the top renderer
      static contextTypes: {
        settings: PropTypes.object,
      };

      /**
       * Set some appropriate default props
       */
      static defaultProps = {
        _dataOptions: {},
        _data: null,
        _hideOnClient: false,
      };

      // Add static methods needed
      static getData(options) {
        // The options object will have user defined settings (from getUserSettings) available as options.__settings
        if (disableServerLoading && typeof window === 'undefined') {
          return Promise.resolve();
        }

        return fetchData(options);
      }

      constructor() {
        super();

        /**
         * Set the initial data state to what we got from props.
         *
         * (might have been loaded server-side)
         */
        this.state = {
          ['__data']: this.props._data,
          ['__error']: false,
        };
      }

      componentDidMount() {
        // We'll assume the component is using aurora-visibility-mixin,
        //  if not we'll default to performing the handling
        const { _hideOnClient } = this.props;

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
      /**
       * Handle updates with new props
       */
      componentWillReceiveProps(nextProps) {
        const {
          _hideOnClient = false,
        } = this.props;

        !this.state['__data'] && this.setState({
          ['__data']: nextProps._data,
        }, () => {
          !_hideOnClient && this._handleData();
        });
      }

      /**
       * General instance method for handling data loading
       */
      _handleData() {
        // Pull out what we need from props
        const {
          _data,
          _dataOptions = {},
        } = this.props;

        // Pull out what we need from context
        const {
          settings = {},
        } = this.context;

        // Pull the 'getData' method that all modules which need data fetching
        // must implement
        const {
          getData = (() => Promise.resolve({ crap: 5 })),
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
            .then(_data => this.setState({ ['__data']: _data }))
            .catch(_data => this.setState({ ['__error']: _data }));
        }
      }

      // Render the component
      render() {
        const data = {
          [dataProp]: this.state.__data,
          [loadingProp]: !this.state.__data,
          [errorProp]: this.state.__error,
        };

        return (
          <Component
            {...this.props}
            {...data}
            reloadFunction={this._handleData}
          />
        );
      }
    }

    // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(WithData, Component);
  };
}
