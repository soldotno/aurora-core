'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Import dependencies
 */
var qs = require('qs');

/**
 * Import utilities
 */
var history = require('./history-api');

/**
 * Export a function that takes
 * an object to update the query string
 */
module.exports = function () {
  var queryUpdate = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  /**
   * Abort if not browser
   */
  if (typeof window === 'undefined') {
    return;
  }

  /**
   * Get the current query string
   */
  var currentQueryString = window.location.search.slice(1);

  /**
   * Parse the query string
   */
  var currentQuery = qs.parse(currentQueryString);

  /**
   * Create the new updated
   * query (assigning to avoid destruction)
   */
  var updatedQuery = _extends({}, currentQuery, queryUpdate);

  /**
   * Stringify the updated query
   * to be a valid query string
   */
  var queryString = '?' + qs.stringify(updatedQuery);

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
  history.replaceState(_extends({}, history.state), null, queryString);
};