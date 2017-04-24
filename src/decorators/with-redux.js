// Dependencies
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';

import getDisplayName from '../utils/get-display-name';

/**
 * Higher order component factory for adding Aurora data fetching.
 */
module.exports = function getWithReduxDecorator({
  reducer = () => console.log('No reducer supplied'),
  initialState = {},
}) {
  // Create a logger (and default to pass-through if not browser)
  const logger = typeof window === 'object' ? (
    createLogger()
  ) : (
    () => next => action => next(action)
  );

  // Create developer tools middleware
  const devTools = (
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
  ) ? (
    window.devToolsExtension()
  ) : (
    f => f
  );

  // Compose a store creator function with middleware
  const finalCreateStore = compose(
    applyMiddleware(thunk, logger),
    devTools
  )(createStore);

  // Create a Redux store
  const makeStore = finalCreateStore.bind(null, reducer, initialState);

  // Return a function that extends a component with redux state handling
  return function withReduxDecorator(Component) {
    // Create a component that wraps our input component in a Redux <Provider>
    class withRedux extends React.Component {
      // Add a specific display name
      static displayName = `${getDisplayName(Component)}WithRedux`;

      // Create a new Redux store for each component instance.
      // This avoids sharing state between instances
      state = {
        store: makeStore(),
      };

      // Render the component wrapped in a Redux <Provider>.
      // This exposes the store and gives children the ability to connect()
      render() {
        return (
          <Provider store={this.state.store}>
            <Component {...this.props} />
          </Provider>
        );
      }
    }

    // Return a decorated component with all the existing static methods hoisted
    return hoistStatics(withRedux, Component);
  };
};
