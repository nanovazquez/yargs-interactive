const inquirer = require('inquirer');
const interactiveMode = require('../src/interactive-mode');

describe('interactive-mode', () => {
  let stubCreatePrompt;
  let stubPrompt;
  let stubSelfContainedPrompt;
  let values;

  beforeAll(() => {
    stubSelfContainedPrompt = jest.fn();
    stubCreatePrompt = jest.spyOn(inquirer, 'createPromptModule').mockReturnValue(stubSelfContainedPrompt);
    stubPrompt = jest.spyOn(inquirer, 'prompt').mockResolvedValue({});
  });

  describe('with no values', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      values = undefined;
      interactiveMode(values);
    });

    test('should call inquirer.createPromptModule() method', () => {
      expect(stubCreatePrompt).toHaveBeenCalled();
    });

    test('should call prompt() of created module', () => {
      expect(stubSelfContainedPrompt).toHaveBeenCalled();
    });

    test('should NOT default inquirer.prompt() method', () => {
      expect(stubPrompt).not.toHaveBeenCalled();
    });
  });

  describe('with values', () => {
    beforeAll(() => {
      jest.clearAllMocks();
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

    test('should call inquirer.createPromptModule() method', () => {
      expect(stubCreatePrompt).toHaveBeenCalled();
    });

    test('should call prompt() of created module', () => {
      expect(stubSelfContainedPrompt).toHaveBeenCalled();
    });

    test('should NOT default inquirer.prompt() method', () => {
      expect(stubPrompt).not.toHaveBeenCalled();
    });

    test('should properly transform the values to inquirer values', () => {
      const args = stubSelfContainedPrompt.mock.calls[0][0];
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

  describe('with support of inquirer plugins', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      values = {
        title: {
          type: 'input',
          describe: 'Do you like plugins?',
          default: 'Who does not?',
        },
      };
      interactiveMode(values, {
        allowInquirerPlugins: true,
      });
    });

    test('should NOT call inquirer.createPromptModule() method', () => {
      expect(stubCreatePrompt).not.toHaveBeenCalled();
    });

    test('should NOT call prompt() of created module', () => {
      expect(stubSelfContainedPrompt).not.toHaveBeenCalled();
    });

    test('should default inquirer.prompt() method', () => {
      expect(stubPrompt).toHaveBeenCalled();
    });

    test('should properly transform the values to inquirer values', () => {
      const args = stubPrompt.mock.calls[0][0];
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
