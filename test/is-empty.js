const assert = require('assert');
const isEmpty = require('../src/is-empty');

describe('is-empty', () => {
  let element;
  let result;
  let expectedResult;

  describe('with no element', () => {
    before(() => {
      element = undefined;
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      assert.equal(result, expectedResult);
    });
  });

  describe('with null element', () => {
    before(() => {
      element = null;
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      assert.equal(result, expectedResult);
    });
  });

  describe('with empty string', () => {
    before(() => {
      element = '';
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      assert.equal(result, expectedResult);
    });
  });

  describe('with empty array', () => {
    before(() => {
      element = [];
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      assert.equal(result, expectedResult);
    });
  });

  describe('with string element', () => {
    before(() => {
      element = 'element';
      result = isEmpty(element);
      expectedResult = false;
    });

    it('should return false', () => {
      assert.equal(result, expectedResult);
    });
  });
});
