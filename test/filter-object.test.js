const filterObject = require('../src/filter-object');

describe('fiter-object', () => {
  let element;
  let condition;
  let result;
  let expectedResult;

  describe('with no element', () => {
    beforeAll(() => {
      result = filterObject();
      expectedResult = {};
    });

    test('should return an empty element', () => {
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('with element', () => {
    beforeAll(() => {
      element = {
        name: {hello: 'world', prompt: true},
        email: {hello: 'world', prompt: true},
        password: {hello: 'world', prompt: false},
      };
    });

    describe('and no condition', () => {
      beforeAll(() => {
        result = filterObject(element);
        expectedResult = Object.assign({}, element);
      });

      test('should return the same element', () => {
        expect(result).toMatchObject(expectedResult);
      });
    });

    describe('and condition', () => {
      beforeAll(() => {
        condition = (item) => item.prompt !== false;
        result = filterObject(element, condition);
        expectedResult = Object.assign({}, element);
        delete expectedResult.password;
      });

      test('should return a filtered element', () => {
        expect(result).toMatchObject(expectedResult);
      });
    });
  });
});
