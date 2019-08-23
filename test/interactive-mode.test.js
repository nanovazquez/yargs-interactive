const inquirer = require('inquirer');
const proxyquire = require('proxyquire');

describe('interactive-mode', () => {
  let inquirerCreatePromptModuleStub;
  let inquirerPromptStub;
  let interactiveMode;
  let values;

  beforeAll(() => {
    inquirerPromptStub = jest.fn();
    inquirerCreatePromptModuleStub = jest.spyOn(inquirer, 'createPromptModule').mockReturnValue(inquirerPromptStub);
    interactiveMode = proxyquire('../src/interactive-mode', {
      'inquirer': {
        createPromptModule: inquirerCreatePromptModuleStub
      },
    });
  });

  describe('with no values', () => {
    beforeAll(() => {
      // Reset stub
      inquirerPromptStub.reset();

      values = undefined;
      interactiveMode(values);
    });

    it('should call createPromptModule', () => {
      expect(inquirerCreatePromptModuleStub).toHaveBeenCalled();
    });

    it('should call prompt', () => {
      expect(inquirerPromptStub).toHaveBeenCalled();
    });
  });

  describe('with values', () => {
    beforeAll(() => {
      // Reset stub
      inquirerPromptStub.reset();

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

    it('should call createPromptModule', () => {
      expect(inquirerCreatePromptModuleStub).toHaveBeenCalled();
    });

    it('should call prompt', () => {
      expect(inquirerPromptStub).toHaveBeenCalled();
    });

    it('should properly transform the values to inquirer values', () => {
      const args = inquirerPromptStub.getCalls()[0].args[0];
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
