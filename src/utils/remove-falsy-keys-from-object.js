/**
 * Export a function that removes all falsy
 * keys from an object and returns the result
 */
module.exports = function removeFalsyKeysFromObject(obj = {}) {
  return Object.keys(obj).reduce((result, key) => {
    return (
      obj[key] &&
      obj[key] !== 0 &&
      obj[key] !== ''
    ) ? {
        ...result,
        [key]: obj[key],
      } : result;
  }, {});
};
