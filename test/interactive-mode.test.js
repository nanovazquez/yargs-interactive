const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const inquirer = require('inquirer');

describe('interactive-mode', () => {
  let inquirerCreatePromptModuleStub;
  let inquirerPromptStub;
  let interactiveMode;
  let values;

  before(() => {
    inquirerPromptStub = sinon.stub();
    inquirerCreatePromptModuleStub = sinon.stub(inquirer, 'createPromptModule').returns(inquirerPromptStub);
    interactiveMode = proxyquire('../src/interactive-mode', {
      'inquirer': {
        createPromptModule: inquirerCreatePromptModuleStub
      },
    });
  });

  describe('with no values', () => {
    before(() => {
      // Reset stub
      inquirerPromptStub.reset();

      values = undefined;
      interactiveMode(values);
    });

    it('should call createPromptModule', () => {
      assert.equal(inquirerCreatePromptModuleStub.called, true);
    });

    it('should call prompt', () => {
      assert.equal(inquirerPromptStub.called, true);
    });
  });

  describe('with values', () => {
    before(() => {
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
      assert.equal(inquirerCreatePromptModuleStub.called, true);
    });

    it('should call prompt', () => {
      assert.equal(inquirerPromptStub.called, true);
    });

    it('should properly transform the values to inquirer values', () => {
      const args = inquirerPromptStub.getCalls()[0].args[0];
      assert.equal(args.length, Object.keys(values).length, 'no. of values sent to inquirer');

      args.forEach((question) => {
        const inputValues = values[question.name];
        assert.ok(inputValues, 'values');
        assert.equal(question.type, inputValues.type, 'type');
        assert.equal(question.message, inputValues.describe, 'message');
        assert.equal(question.default, inputValues.default, 'default');
        assert.equal(question.choices, inputValues.choices, 'choices');
      });
    });
  });
});
