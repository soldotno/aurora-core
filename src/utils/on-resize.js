/**
 * Helper function for adding
 * a browser resize event listener
 */
module.exports = function onResize(callback) {
  window.addEventListener('resize', callback);
};
