/**
 * Helper function for adding
 * a browser resize event listener
 */
module.exports = function onScroll(callback) {
  window.addEventListener('scroll', callback);
};
