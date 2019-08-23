const proxyquire = require('proxyquire');

function checkProperties(result, expectedValues = {}) {
  expect(!!result._).toBe(true);
  expect(!!result.$0).toBe(true);
  expect(result.version).toBe(!!expectedValues.version);
  expect(result.help).toBe(!!expectedValues.help);
  expect(result.interactive).toBe(!!expectedValues.interactive);
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

  beforeAll(() => {
    // interactiveModeStub = sinon.stub().resolves({});
    interactiveModeStub = jest.fn();
    yargsInteractive = proxyquire('../src/yargs-interactive', {
      './interactive-mode': interactiveModeStub,
    });
  });

  describe('with no interactive', () => {
    beforeAll(() => {
      interactiveModeStub.resetHistory();
      result = yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help()
          .argv;
    });

    it('should not set interactive argument', () => {
      expect(result.interactive).toBeUndefined();
    });

    it('should not call interactive mode', () => {
      expect(interactiveModeStub).not.toHaveBeenCalledWith('interactive mode');
    });
  });

  describe('with no options', () => {
    beforeAll(() => {
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

    beforeAll(() => {
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
      beforeAll(() => {
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
          expect(result[key]).toBe(options[key].default);
        });
      });
    });

    describe('and parameters', () => {
      let expectedParameters;

      beforeAll(() => {
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
          expect(result[key]).toBe(expectedParameters[key]);
        });
      });
    });

    describe('and interactive parameter', () => {
      beforeAll(() => {
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
        expect(interactiveModeStub).toHaveBeenCalledWith('interactive mode');
      });
    });

    describe('and interactive option', () => {
      beforeAll(() => {
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
        expect(interactiveModeStub).toHaveBeenCalledWith('interactive mode');
      });
    });
  });

  describe('with options using different prompt values', () => {
    let yargsInteractiveArgs;
    let promptedOptions;
    let options;

    beforeAll(() => {
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
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeTruthy());
    });

    it('should not prompt options with prompt set as "never"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'never'});
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeUndefined());
    });

    // if-empty

    it('should prompt options with no value set and prompt set as "if-empty"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: false});
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeTruthy());
    });

    it('should not prompt options with default value set and prompt set as "if-empty"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: true});
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeUndefined());
    });

    // no prompt (defaults to 'if-empty')

    it('should prompt options with no value set and prompt not set', () => {
      const optionKeys = getOptionKeys({options, prompt: undefined});
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeTruthy());
    });

    it('should not prompt options with default value set and prompt not set', () => {
      const optionKeys = getOptionKeys({options, prompt: undefined, hasDefaultValue: false});
      optionKeys.forEach((key) => expect(promptedOptions[key]).toBeTruthy());
    });

    // if-no-arg

    it('should prompt options with no args and prompt set as "if-no-arg"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
      optionKeys.forEach((key) => {
        const promptedOption = promptedOptions[key];
        const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
        if (!optionSentByArgument) {
          expect(promptedOption).toBeTruthy();
        }
      });
    });

    it('should not prompt options with value sent in args and prompt set as "if-no-arg"', () => {
      const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
      optionKeys.forEach((key) => {
        const promptedOption = promptedOptions[key];
        const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
        if (optionSentByArgument) {
          expect(promptedOption).toBeUndefined();
        }
      });
    });
  });
});
