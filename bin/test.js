#! /usr/bin/env node

const yargsInteractive = require('./yargs-interactive');

// const result = yargsInteractive();

const options = {
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

/* eslint require-jsdoc: 0 */
function basicTest() {
  return yargsInteractive
    .usage('$0 <command> [args]')
    .version()
    .help()
    .interactive()
    .then((result) => {
      const isValid = result._ && result._.length == 0
        && !result.version
        && !result.help
        && !result.interactive
        && result.$0 === 'bin/test.js';
      console.log(result, isValid);
    });
}

function withData() {
  return yargsInteractive
    .usage('$0 <command> [args]')
    .version()
    .help()
    .interactive(options)
    .then((result) => {
      const isValid = result._ && result._.length == 0
        && !result.version
        && !result.help
        && !result.interactive
        && result.directory === '.'
        && result.projectName === 'custom'
        && result.$0 === 'bin/test.js';
      console.log(result, isValid);
    });
}

function interactiveMode() {
  return yargsInteractive
    .usage('$0 <command> [args]')
    .version()
    .help()
    .interactive(options)
    .then((result) => {
      const isValid = result._ && result._.length == 0
        && !result.version
        && !result.help
        && result.interactive
        && result.directory === 'a'
        && result.projectName === 'b'
        && result.$0 === 'bin/test.js';
      console.log(result, isValid);
    });
}

// ➜ node ./bin/test.js
// basicTest();
// withData();

// ➜ node ./bin/test.js --interactive
interactiveMode();

// mixedModel

// prompt things and don't prompt things (filter things)
