/* global __DEVELOPMENT__ */

// Dependencies
import isClient from 'is-client';
import injectStyles from 'style-loader/addStyles';

const isBrowser = isClient();

/**
 * Export a mixin that handles the injection of styles
 * in an Aurora module
 */
export default function styleInjectMixin(clientStyles) {
  return {
    /**
     * This is the code used for
     * dynamically injection styles
     * when the page is loaded on
     * the client
     *
     * We also want to avoid doing
     * this in development since
     * we want hot loading (thus doing this another way)
     */
    componentWillMount() {
      if (isBrowser && !__DEVELOPMENT__) {
        injectStyles(clientStyles);
      }
    },
  };
}
