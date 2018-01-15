const assert = require('assert');
const filterObject = require('../src/filter-object');

describe('fiter-object', () => {
  let element;
  let condition;
  let result;
  let expectedResult;

  describe('with no element', () => {
    before(() => {
      result = filterObject();
      expectedResult = {};
    });

    it('should return an empty element', () => {
      assert.deepEqual(result, expectedResult);
    });
  });

  describe('with element', () => {
    before(() => {
      element = {
        name: {hello: 'world', prompt: true},
        email: {hello: 'world', prompt: true},
        password: {hello: 'world', prompt: false},
      };
    });

    describe('and no condition', () => {
      before(() => {
        result = filterObject(element);
        expectedResult = Object.assign({}, element);
      });

      it('should return the same element', () => {
        assert.deepEqual(result, expectedResult);
      });
    });

    describe('and condition', () => {
      before(() => {
        condition = (item) => item.prompt !== false;
        result = filterObject(element, condition);
        expectedResult = Object.assign({}, element);
        delete expectedResult.password;
      });

      it('should return a filtered element', () => {
        assert.deepEqual(result, expectedResult);
      });
    });
  });
});
