'use strict';

var _onScroll = require('./on-scroll');

var _onScroll2 = _interopRequireDefault(_onScroll);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a constant for the state
 */
/**
 * Import utilities
 */
var AURORA_SCROLL_POSITION = 'AURORA_SCROLL_POSITION';
var AURORA_PREVIOUS_LOCATION = 'AURORA_PREVIOUS_LOCATION';

/**
 * Helper function for adding
 * a browser resize event listener
 */
module.exports = function () {
  var currentLocation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  /**
   * Abort if not in a browser
   */
  if (typeof window === 'undefined') {
    return;
  }

  /**
   * Pull the previous location and
   * scroll position from session storage
   */
  var previousLocation = sessionStorage.getItem(AURORA_PREVIOUS_LOCATION);
  var lastScrollPosition = sessionStorage.getItem(AURORA_SCROLL_POSITION);

  /**
   * Abort if we're on a different route
   */
  if (currentLocation === previousLocation) {
    /**
     * Scroll to the last known position
     */
    lastScrollPosition && window.scrollTo(0, lastScrollPosition);
  }

  /**
   * Create a function that handles
   * updating the session storage
   */
  var handleScroll = (0, _lodash2.default)(function () {
    /**
     * Pull the current path
     */
    var currentLocation = window.location.pathname + window.location.search;

    /**
     * Update session state
     */
    sessionStorage.setItem(AURORA_PREVIOUS_LOCATION, currentLocation);
    sessionStorage.setItem(AURORA_SCROLL_POSITION, window.scrollY);
  }, 50);

  /**
   * Track the scroll position
   */
  (0, _onScroll2.default)(handleScroll);
  /**
   * Do the initial handling
   */
  handleScroll();
};