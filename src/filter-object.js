/**
 * Filter keys in an object based on a condition.
 * @param {object} element The element whose keys will be filtered.
 * @param {any} condition (value, key) => boolean
 * The condition to execute in each key value (i.e. if condition(value, key) returns true, the key is kept).
 * @return {object} A new object with only the keys that pass the condition.
 */
module.exports = (element = {}, condition = () => true) => {
  const toReturn = {};

  Object.keys(element).forEach((key) => {
    const value = element[key];
    if (condition(value, key)) {
      toReturn[key] = value;
    }
  });

  return toReturn;
};
