require('jest-matcher-one-of');
const yargsInteractive = require('../src/yargs-interactive');

const interactiveMode = require('../src/interactive-mode');
jest.mock('../src/interactive-mode', () => jest.fn());

function checkProperties(result, expectedValues = {}) {
  expect(!!result._).toBeTruthy();
  expect(!!result.$0).toBe(true);
  if ('version' in expectedValues) expect(result.version).toBe(expectedValues.version);
  if ('help' in expectedValues) expect(result.help).toBe(expectedValues.help);
  if ('interactive' in expectedValues) expect(result.interactive).toBe(expectedValues.interactive);
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

  beforeAll(() => {
    interactiveMode.mockReturnValue(Promise.resolve({}));
  });

  describe('with no interactive', () => {
    beforeAll(() => {
      interactiveMode.mockClear();
      result = yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help().argv;
    });

    test('should not set interactive argument', () => {
      expect(result.interactive).toBeUndefined();
    });

    test('should not call interactive mode', () => {
      expect(interactiveMode).not.toHaveBeenCalled();
    });
  });

  describe('with no options', () => {
    beforeAll(() => {
      interactiveMode.mockClear();
      return yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive()
          .then((output) => (result = output));
    });

    test('should return yargs default properties', () => {
      checkProperties(result);
    });

    test('should not call interactive mode', () => {
      expect(interactiveMode).not.toHaveBeenCalled();
    });
  });

  describe('with options', () => {
    let options;

    beforeAll(() => {
      options = {
        directory: {
          type: 'input',
          default: '.',
          describe: 'Target directory'
        },
        projectName: {
          type: 'input',
          default: 'custom',
          describe: 'Project name',
          prompt: 'if-empty'
        }
      };
    });

    describe('and no parameters', () => {
      beforeAll(() => {
        interactiveMode.mockClear();
        return yargsInteractive()
            .usage('$0 <command> [args]')
            .version()
            .help()
            .interactive(options)
            .then((output) => (result = output));
      });

      test('should return yargs default properties', () => {
        checkProperties(result);
      });

      test('should return options with default values', () => {
        Object.keys(options).forEach((key) => {
          expect(result[key]).toBe(options[key].default);
        });
      });

      test('should not call interactive mode', () => {
        expect(interactiveMode).not.toHaveBeenCalled();
      });
    });

    describe('and parameters', () => {
      let expectedParameters;

      beforeAll(() => {
        interactiveMode.mockClear();

        expectedParameters = {directory: 'abc', projectName: 'def'};
        return yargsInteractive(Object.keys(expectedParameters).map((key) => `--${key}=${expectedParameters[key]}`))
            .usage('$0 <command> [args]')
            .version()
            .help()
            .interactive(options)
            .then((output) => (result = output));
      });

      test('should return yargs default properties', () => {
        checkProperties(result);
      });

      test('should return options with values sent by parameter', () => {
        Object.keys(options).forEach((key) => {
          expect(result[key]).toBe(expectedParameters[key]);
        });
      });

      test('should not call interactive mode', () => {
        expect(interactiveMode).not.toHaveBeenCalled();
      });
    });

    describe('and interactive parameter', () => {
      beforeAll(() => {
        interactiveMode.mockClear();

        return yargsInteractive(`--interactive`)
            .usage('$0 <command> [args]')
            .version()
            .help()
            .interactive({...options, interactive: {default: true}})
            .then((output) => (result = output));
      });

      test('should return yargs default properties', () => {
        checkProperties(result, {interactive: true});
      });

      test('should call interactive mode', () => {
        expect(interactiveMode).toHaveBeenCalled();
      });
    });

    describe('and interactive option', () => {
      beforeAll(() => {
        interactiveMode.mockClear();

        const optionsWithInteractive = Object.assign({}, options, {interactive: {default: true}});
        return yargsInteractive()
            .usage('$0 <command> [args]')
            .version()
            .help()
            .interactive(optionsWithInteractive)
            .then((output) => (result = output));
      });

      test('should return yargs default properties', () => {
        checkProperties(result, {interactive: true});
      });

      test('should call interactive mode', () => {
        expect(interactiveMode).toHaveBeenCalled();
      });
    });

    describe('with options using different prompt values', () => {
      let yargsInteractiveArgs;
      let options;

      beforeAll(() => {
        interactiveMode.mockClear();

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
            });
      });

      test('should prompt options with prompt set as "always"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'always'});
        optionKeys.forEach((key) => expect(result[key]).toBe('.'));
      });

      test('should not prompt options with prompt set as "never"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'never'});
        optionKeys.forEach((key) => expect(result[key]).toBe('.'));
      });

      // if-empty

      test('should prompt options with no value set and prompt set as "if-empty"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: false});
        optionKeys.forEach((key) => expect(result[key]).toBeUndefined());
      });

      test('should not prompt options with default value set and prompt set as "if-empty"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'if-empty', hasDefaultValue: true});
        optionKeys.forEach((key) => expect(result[key]).toBe('.'));
      });

      // no prompt (defaults to 'if-empty')

      test('should prompt options with no value set and prompt not set', () => {
        const optionKeys = getOptionKeys({options, prompt: undefined});
        optionKeys.forEach((key) => expect(result[key]).toBeUndefined());
      });

      test('should not prompt options with default value set and prompt not set', () => {
        const optionKeys = getOptionKeys({options, prompt: undefined, hasDefaultValue: false});
        optionKeys.forEach((key) => expect(result[key]).toBeUndefined());
      });

      // if-no-arg

      test('should prompt options with no args and prompt set as "if-no-arg"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
        optionKeys.forEach((key) => {
          const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
          expect(optionSentByArgument).toBeOneOf([true, false]);
        });
      });

      test('should not prompt options with value sent in args and prompt set as "if-no-arg"', () => {
        const optionKeys = getOptionKeys({options, prompt: 'if-no-arg'});
        optionKeys.forEach((key) => {
          const optionSentByArgument = yargsInteractiveArgs.find((arg) => arg.startsWith(`--${key}`)) !== undefined;
          expect(optionSentByArgument).toBeOneOf([true, false]);
        });
      });
    });
  });
});
