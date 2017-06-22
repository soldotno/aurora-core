// Dependencies
import qs from 'qs';

// Utilities
import history from './history-api';

// Export a function that takes an object to update the query string
export default function updateQueryString(queryUpdate = {}) {
  /**
   * Abort if not browser
   */
  if (typeof window === 'undefined') {
    return;
  }

  /**
   * Get the current query string
   */
  const currentQueryString = window.location.search.slice(1);

  /**
   * Parse the query string
   */
  const currentQuery = qs.parse(currentQueryString);

  /**
   * Create the new updated
   * query (assigning to avoid destruction)
   */
  const updatedQuery = {
    ...currentQuery,
    ...queryUpdate,
  };

  /**
   * Stringify the updated query
   * to be a valid query string
   */
  const queryString = `?${qs.stringify(updatedQuery)}`;

  /**
   * Put the pagination and version
   * fields into the query with
   * the history pushState API
   *
   * NOTE: We're actually replacing
   * the whole browser history state
   * for this page, since we don't want
   * the user to click back and just
   * be taken a bit back on the same
   * page, but all the way back to
   * the previous page visited
   */
  history.replaceState({ ...history.state }, null, queryString);
}
