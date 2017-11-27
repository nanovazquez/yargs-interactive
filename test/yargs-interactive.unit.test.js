const yargsInteractive = require('../bin/yargs-interactive');
const assert = require('assert');

function runBasicValidations(result) {
  assert.deepEqual(!!result._, true, '_');
  assert.equal(!!result.$0, true, '$0');
  assert.equal(result.version, false, 'version');
  assert.equal(result.help, false, 'help');
  assert.equal(result.interactive, false, 'interactive');
}

describe('yargsInteractive', () => {
  let result;

  describe('with no interactive', () => {
    beforeEach(() => {
      result = yargsInteractive()
        .usage('$0 <command> [args]')
        .version()
        .help()
        .argv;
    });

    it('should not set interactive argument', () => {
      assert.equal(result.interactive, undefined, 'interactive');
    });
  });

  describe('with no options', () => {
    beforeEach(() => {
      return yargsInteractive()
        .usage('$0 <command> [args]')
        .version()
        .help()
        .interactive()
        .then((output) => result = output);
    });

    it('should return yargs default properties', () => {
      runBasicValidations(result);
    });
  });

  describe('with options', () => {
    let options;

    beforeEach(() => {
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
        },
      };
    });

    describe('and no parameters', () => {
      beforeEach(() => {
        return yargsInteractive()
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => result = output);
      });

      it('should return yargs default properties', () => {
        runBasicValidations(result);
      });

      it('should return options with default values', () => {
        Object.keys(options).forEach((key) => {
          assert.equal(result[key], options[key].default, key);
        });
      });
    });

    describe('and parameters', () => {
      let expectedParameters;
      beforeEach(() => {
        expectedParameters = {directory: 'abc', projectName: 'def'};
        return yargsInteractive(Object.keys(expectedParameters).map((key) => `--${key}=${expectedParameters[key]}`))
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => result = output);
      });

      it('should return yargs default properties', () => {
        runBasicValidations(result);
      });

      it('should return options with values sent by parameter', () => {
        Object.keys(options).forEach((key) => {
          assert.equal(result[key], expectedParameters[key], key);
        });
      });
    });
  });
});
