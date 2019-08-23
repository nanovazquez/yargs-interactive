const isEmpty = require('../src/is-empty');

describe('is-empty', () => {
  let element;
  let result;
  let expectedResult;

  describe('with no element', () => {
    beforeAll(() => {
      element = undefined;
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with null element', () => {
    beforeAll(() => {
      element = null;
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with empty string', () => {
    beforeAll(() => {
      element = '';
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with empty array', () => {
    beforeAll(() => {
      element = [];
      result = isEmpty(element);
      expectedResult = true;
    });

    it('should return true', () => {
      expect(result).toEqual(expectedResult);
    });
  });

  describe('with string element', () => {
    beforeAll(() => {
      element = 'element';
      result = isEmpty(element);
      expectedResult = false;
    });

    it('should return false', () => {
      expect(result).toEqual(expectedResult);
    });
  });
});
