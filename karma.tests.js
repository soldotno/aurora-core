/**
 * Use the babel polyfill
 * to support all ES6 features
 * in tests
 */
require('babel-polyfill');

/**
 * Make console.warn throw
 */
let warn = console.warn;
console.warn = function (warning) {
  throw new Error(warning);
  warn.apply(console, arguments);
};

/**
 * Make console.error throw
 */
let err = console.error;
console.error = function (warning) {
  throw new Error(warning);
  err.apply(console, arguments);
};

/**
 * Automatically include all test files
 * of the pattern '.src/***.test.client.js(x)'
 */
const context = require.context('./src/', true, /.+\.test.client\.jsx?$/);
context.keys().forEach(context);

/**
 * Export all the required tests
 */
module.exports = context;
