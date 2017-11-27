const yargsInteractive = require('../bin/yargs-interactive');
const robot = require('robotjs');
const assert = require('assert');

describe('yargsInteractive', () => {
  let result;

  describe('interactive', () => {
    let options;
    let expectedResult;

    beforeEach(() => {
      expectedResult = {directory: 'abc123', projectName: 'hello-world'};
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
        const promise = yargsInteractive('--interactive')
          .usage('$0 <command> [args]')
          .version()
          .help()
          .interactive(options)
          .then((output) => result = output);

        setTimeout(() => {
          robot.typeString(expectedResult.directory);
          robot.keyTap('enter');
        }, 0);

        setTimeout(() => {
          robot.typeString(expectedResult.projectName);
          robot.keyTap('enter');
        }, 50);

        return promise;
      });

      it('should return yargs default properties', () => {
        assert.equal(result.directory, expectedResult.directory);
        assert.equal(result.projectName, expectedResult.projectName);
      });
    });
  });
});
