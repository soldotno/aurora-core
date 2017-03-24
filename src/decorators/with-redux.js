/**
 * Dependencies
 */
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

/**
 * Higher order component factory
 * for adding Aurora data fetching
 */
module.exports = function({
  reducer = () => console.log('No reducer supplied'),
  initialState = {},
}) {
  /**
   * Create a logger (and default to pass-through if not browser)
   */
  const logger = typeof window === 'object' ? (
    createLogger()
  ) : (
    () => next => action => next(action)
  );

  /**
   * Create developer tools middleware
   */
  const devTools = (
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
  ) ? (
    window.devToolsExtension()
  ) : (
    (f) => f
  );

  /**
   * Compose a store creator function with middleware
   */
  const finalCreateStore = compose(
    applyMiddleware(thunk, logger),
    devTools
  )(createStore);

  /**
   * Create a Redux store
   */
  const makeStore = finalCreateStore.bind(null, reducer, initialState);

  /**
   * Return a function that extends
   * a component with redux state handling
   */
  return function(Component) {
    /**
     * Create a component that wraps
     * our input component in a Redux <Provider>
     */
    const withRedux = React.createClass({
      /**
       * Add a specific display name
       */
      displayName: 'withRedux',

      /**
       * Create a new Redux store for
       * each component instance,
       * to avoid sharing state between instances
       */
      getInitialState() {
        return {
          store: makeStore()
        };
      },

      /**
       * Render the component wrapped
       * in a Redux <Provider> to expose
       * the store and give children the
       * ability to connect()
       */
      render() {
        return (
          <Provider store={this.state.store}>
            <Component {...this.props} />
          </Provider>
        );
      }
    });

    /**
     * Return a decorated component
     * with all the existing static
     * methods hoisted
     */
    return hoistStatics(withRedux, Component);
  };
};
