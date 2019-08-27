#!/usr/bin/env node

/*
 * Usage 1:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/prompt.js --interactive
 * Result: The tool will ask for the name (as pizza has a default value and, by default, we don't prompt args with values)
 *
 * Usage 2:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/prompt.js --name="John"
 * Result: The tool won't prompt as it has all it needs. If you want to configure this, see the "prompt" option in the README.
 */

const yargsInteractive = require('../src');

const options = {
  name: {
    type: 'input',
    describe: 'Enter your name'
  },
  likesPizza: {
    type: 'confirm',
    default: false,
    describe: 'Do you like pizza?'
  }
};

yargsInteractive()
    .usage('$0 <command> [args]')
    .interactive(options)
    .then((result) => {
      console.log(`\nResult is:\n` + `- Name: ${result.name}\n` + `- Likes pizza: ${result.likesPizza}\n`);
    });
