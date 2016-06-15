/**
 * Import utilities
 */
import onScroll from './on-scroll';

/**
 * Create a constant for the state
 */
const AURORA_SCROLL_POSITION = 'AURORA_SCROLL_POSITION';
const AURORA_PREVIOUS_LOCATION = 'AURORA_PREVIOUS_LOCATION';

/**
 * Helper function for adding
 * a browser resize event listener
 */
module.exports = function(currentLocation = '') {
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
  const previousLocation = sessionStorage.getItem(AURORA_PREVIOUS_LOCATION);
  const lastScrollPosition = sessionStorage.getItem(AURORA_SCROLL_POSITION);

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
  const handleScroll = () => {
    /**
     * Pull the current path
     */
    const currentLocation = window.location.pathname + window.location.search;

    /**
     * Update session state
     */
    sessionStorage.setItem(AURORA_PREVIOUS_LOCATION, currentLocation);
    sessionStorage.setItem(AURORA_SCROLL_POSITION, window.scrollY);
  };

  /**
   * Track the scroll position
   */
  onScroll(handleScroll);
  /**
   * Do the initial handling
   */
  handleScroll();
};
