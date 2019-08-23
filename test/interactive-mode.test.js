const inquirer = require('inquirer');
const {interactiveMode} = require('../src/interactive-mode');

describe('interactive-mode', () => {
  let inquirerCreatePromptModuleStub;
  let inquirerPromptStub;
  let values;

  beforeAll(() => {
    inquirerPromptStub = jest.fn();
    inquirerCreatePromptModuleStub = jest.spyOn(inquirer, 'createPromptModule').mockReturnValue(inquirerPromptStub);
  });

  describe('with no values', () => {
    beforeAll(() => {
      values = undefined;
      interactiveMode(values);
    });

    test('should call createPromptModule', () => {
      expect(inquirerCreatePromptModuleStub).toHaveBeenCalled();
    });

    test('should call prompt', () => {
      expect(inquirerPromptStub).toHaveBeenCalled();
    });
  });

  describe('with values', () => {
    beforeAll(() => {
      values = {
        title: {
          type: 'input',
          describe: 'Message to display',
          default: 'default value',
        },
        message: {
          type: 'list',
          describe: 'Welcome message',
          choices: ['hi', 'hello', 'hola!'],
        }
      };
      interactiveMode(values);
    });

    test('should call createPromptModule', () => {
      expect(inquirerCreatePromptModuleStub).toHaveBeenCalled();
    });

    test('should call prompt', () => {
      expect(inquirerPromptStub).toHaveBeenCalled();
    });

    test('should properly transform the values to inquirer values', () => {
      const args = inquirerPromptStub.mock.calls[1][0];
      expect(args.length).toEqual(Object.keys(values).length);

      args.forEach((question) => {
        const inputValues = values[question.name];
        expect(inputValues).toBeTruthy();
        expect(question.type).toBe(inputValues.type);
        expect(question.message).toBe(inputValues.describe);
        expect(question.default).toBe(inputValues.default);
        expect(question.choices).toBe(inputValues.choices);
      });
    });
  });
});
