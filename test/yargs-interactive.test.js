const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

function checkProperties(result, expectedValues = {}) {
  assert.equal(!!result._, true, '_');
  assert.equal(!!result.$0, true, '$0');
  assert.equal(result.version, !!expectedValues.version, 'version');
  assert.equal(result.help, !!expectedValues.help, 'help');
  assert.equal(result.interactive, !!expectedValues.interactive, 'interactive');
}

function getOptionKeys({options, prompt, hasDefaultValue}) {
  const checkDefaultValue = (item) => (hasDefaultValue && item.default) || (!hasDefaultValue && item.default === undefined);
  return Object.keys(options).reduce((acc, key) => {
    const item = options[key];
    const shouldCheckDefaultValue = hasDefaultValue !== undefined;
    if (item.prompt === prompt && ((shouldCheckDefaultValue && checkDefaultValue(item)) || !shouldCheckDefaultValue)) {
      acc.push(key);
    }

    return acc;
  }, []);
}

describe('yargsInteractive', () => {
  let result;
  let interactiveModeStub;
  let yargsInteractive;

  before(() => {
    interactiveModeStub = sinon.stub().resolves({});
    yargsInteractive = proxyquire('../src/yargs-interactive', {
      './interactive-mode': interactiveModeStub,
    });
  });

  describe('with no interactive', () => {
    before(() => {
      interactiveModeStub.resetHistory();
      result = yargsInteractive()
        .usage('$0 <command> [args]')
        .version()
        .help()
        .argv;
    });

    it('should not set interactive argument', () => {
      assert.equal(result.interactive, undefined, 'interactive');
    });

    it('should not call interactive mode', () => {
      assert.equal(interactiveModeStub.called, false, 'interactive mode');
    });
  });

  describe('with no options', () => {
    before(() => {
      interactiveModeStub.resetHistory();
      return yargsInteractive()
        .usage('$0 <command> [args]')
        .version()
        .help()
        .interactive()
        .then((output) => (result = output));
    });

    it('should return yargs default properties', () => {
      checkProperties(result);
    });
  });

  describe('with options', () => {
    let options;

    before(() => {
      options = {
        directory: {
          type: 'input',
          default: '.',
          describe: 'Target directory',
        },
        projectName: {
          type: 'input',
          default: 'custom',
          describe: 'Project name',
          prompt: 'if-empty',
        },
      };
    });

    describe('and no parameters', () => {
      before(() => {
        interactiveModeStub.resetHistory();
        return yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => (result = output));
      });

      it('should return yargs default properties', () => {
        checkProperties(result);
      });

      it('should return options with default values', () => {
        Object.keys(options).forEach((key) => {
          assert.equal(result[key], options[key].default, key);
        });
      });
    });

    describe('and parameters', () => {
      let expectedParameters;

      before(() => {
        interactiveModeStub.resetHistory();
        expectedParameters = {directory: 'abc', projectName: 'def'};
        return yargsInteractive(Object.keys(expectedParameters).map((key) => `--${key}=${expectedParameters[key]}`))
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => (result = output));
      });

      it('should return yargs default properties', () => {
        checkProperties(result);
      });

      it('should return options with values sent by parameter', () => {
        Object.keys(options).forEach((key) => {
          assert.equal(result[key], expectedParameters[key], key);
        });
      });
    });

    describe('and interactive parameter', () => {
      before(() => {
        interactiveModeStub.resetHistory();
        return yargsInteractive(`--interactive`)
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => (result = output));
      });

      it('should return yargs default properties', () => {
        checkProperties(result, {interactive: true});
      });

      it('should call interactive mode', () => {
        assert.equal(interactiveModeStub.called, true, 'interactive mode');
      });
    });

    describe('and interactive option', () => {
      before(() => {
        interactiveModeStub.resetHistory();
        const optionsWithInteractive = Object.assign({}, options, {interactive: {default: true}});
        return yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(optionsWithInteractive)
          .then((output) => (result = output));
      });

      it('should return yargs default properties', () => {
        checkProperties(result, {interactive: true});
      });

      it('should call interactive mode', () => {
        assert.equal(interactiveModeStub.called, true, 'interactive mode');
      });
    });
  });

  describe('with options using different prompt values', () => {
    let yargsInteractiveArgs;
    let promptedOptions;
    let options;

    before(() => {
      interactiveModeStub.resetHistory();
      yargsInteractiveArgs = [`--interactive`, `--option8='value'`];
      options = {
        option1: {type: 'input', describe: 'option1', default: '.', prompt: 'always'},
        option2: {type: 'input', describe: 'option2', default: '.', prompt: 'never'},

        // if-empty
        option3: {type: 'input', describe: 'option3', prompt: 'if-empty'},
        option4: {type: 'input', describe: 'option4', default: '.', prompt: 'if-empty'},

        // no prompt (defaults to 'if-empty')
        option5: {type: 'input', describe: 'option5'},
        option6: {type: 'input', describe: 'option6'},

        // if-no-arg
        option7: {type: 'input', describe: 'option7', default: '.', prompt: 'if-no-arg'},
        option8: {type: 'input', describe: 'option8', default: '.', prompt: 'if-no-arg'}
      };

      return yargsInteractive(yargsInteractiveArgs)
        .usage('$0 <command> [args]')
        .version()
        .help()
        .interactive(options)
        .then((output) => {
          result = output;
          promptedOptions = interactiveModeStub.args[0][0];
        });
    });

    it('should prompt options with prompt set as "always"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'always'});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key], `${key} not prompted`));
    });

    it('should not prompt options with prompt set as "never"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'never'});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key] === undefined, `${key} should not prompt`));
    });

    // if-empty

    it('should prompt options with no value set and prompt set as "if-empty"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: false});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key], `${key} should prompt`));
    });

    it('should not prompt options with default value set and prompt set as "if-empty"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: true});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key] === undefined, `${key} should not prompt`));
    });

    // no prompt (defaults to 'if-empty')

    it('should prompt options with no value set and prompt not set', () => {
      const optionKeys = getOptionKeys({options, prompt: undefined});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key], `${key} should prompt`));
    });

    it('should not prompt options with default value set and prompt not set', () => {
      const optionKeys = getOptionKeys({options, prompt: undefined, hasDefaultValue: false});
      optionKeys.forEach((key) => assert.ok(promptedOptions[key], `${key} should prompt`));
    });

    // if-no-arg

    it('should prompt options with no args and prompt set as "if-no-arg"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
      optionKeys.forEach((key) => {
        const promptedOption = promptedOptions[key];
        const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
        if (!optionSentByArgument) {
          assert.ok(promptedOption, `${key} should prompt`);
        }
      });
    });

    it('should not prompt options with value sent in args and prompt set as "if-no-arg"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
      optionKeys.forEach((key) => {
        const promptedOption = promptedOptions[key];
        const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
        if (optionSentByArgument) {
          assert.ok(promptedOption === undefined, `${key} should not prompt`);
        }
      });
    });
  });
});
