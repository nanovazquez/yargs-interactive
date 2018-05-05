/**
 * Checks if the element received is empty or not.
 * @param {Object} element - The element to check.
 * @return {boolean} - Returns true if the element is undefined, null, is an empty string or an empty array.
 */
module.exports = (element) => {
  return element === undefined
    || element === null
    || element === ''
    || (Array.isArray(element) && !element.length)
  ;
};
