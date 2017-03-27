/**
 * Dependencies
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

/**
 * Reducers
 */
import rootReducer from '../reducers';

/**
 * Create a logger
 */
const logger = createLogger();

/**
 * Export a function that
 * creates a store with
 * an optional initial state
 */
export default function configureStore(initialState) {
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
   * Create the actual store
   */
  const store = finalCreateStore(rootReducer, initialState);

  /**
   * Enable Webpack hot module replacement for reducers
   */
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  /**
   * Return the store
   */
  return store;
}
