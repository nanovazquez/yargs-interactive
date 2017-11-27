// Filter keys in an object based on a condition,
// returning a new object with the keys that pass the test.
// (i.e. if condition(key) returns true, the key is kept).
module.exports = (element = {}, condition = () => true) => {
  const toReturn = {};

  Object.keys(element).forEach((key) => {
    const value = element[key];
    if (condition(value)) {
      toReturn[key] = value;
    }
  });

  return toReturn;
};
