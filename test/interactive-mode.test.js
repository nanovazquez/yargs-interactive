const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const inquirer = require('inquirer');

describe('interactive-mode', () => {
  let inquirerCreatePromptModuleStub;
  let inquirerPromptStub;
  let interactiveMode;
  let defaultValues;

  before(() => {
    inquirerPromptStub = sinon.stub();
    inquirerCreatePromptModuleStub = sinon.stub(inquirer, 'createPromptModule').returns(inquirerPromptStub);
    interactiveMode = proxyquire('../src/interactive-mode', {
      'inquirer': {createPromptModule: inquirerCreatePromptModuleStub},
    });
    defaultValues = {
      title: {
        type: 'input',
        describe: 'Message to display',
        default: 'default value',
        options: ['title1', 'title2']
      }
    };

    interactiveMode(defaultValues);
  });

  it('should call createPromptModule', () => {
    assert.equal(inquirerCreatePromptModuleStub.called, true);
  });

  it('should call prompt', () => {
    assert.equal(inquirerPromptStub.called, true);
  });

  it('should properly transform the values to inquirer values', () => {
    const args = inquirerPromptStub.getCalls()[0].args[0];
    args.forEach((question) => {
      const inputValues = defaultValues[question.name];
      assert.ok(inputValues, 'values');
      assert.equal(question.type, inputValues.type, 'type');
      assert.equal(question.message, inputValues.describe, 'message');
      assert.equal(question.default, inputValues.default, 'default');
      assert.equal(question.choices, inputValues.options, 'choices');
    });
  });
});
