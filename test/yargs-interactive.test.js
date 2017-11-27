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

describe('yargsInteractive', () => {
  let result;
  let interactiveModeStub;
  let yargsInteractive;

  beforeEach(() => {
    interactiveModeStub = sinon.stub().resolves({});
    yargsInteractive = proxyquire('../bin/yargs-interactive', {
      '../src/interactive-mode': interactiveModeStub,
    });
  });

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

    it('should not call interactive mode', () => {
      assert.equal(interactiveModeStub.called, false, 'interactive mode');
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
      checkProperties(result);
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
        checkProperties(result);
      });

      it('should return options with values sent by parameter', () => {
        Object.keys(options).forEach((key) => {
          assert.equal(result[key], expectedParameters[key], key);
        });
      });
    });

    describe('and interactive parameter', () => {
      beforeEach(() => {
        return yargsInteractive(`--interactive`)
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => result = output);
      });

      it('should return yargs default properties', () => {
        checkProperties(result, {interactive: true});
      });

      it('should call interactive mode', () => {
        assert.equal(interactiveModeStub.called, true, 'interactive mode');
      });
    });
  });
});
