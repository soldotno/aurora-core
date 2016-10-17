'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Export a function that removes all falsy
 * keys from an object and returns the result
 */
module.exports = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.keys(obj).reduce(function (result, key) {
    return obj[key] && obj[key] !== 0 && obj[key] !== '' ? _extends({}, result, _defineProperty({}, key, obj[key])) : result;
  }, {});
};