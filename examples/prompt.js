#!/usr/bin/env node

/*
 * Usage 1:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/prompt.js --interactive
 * Result: The tool will prompt question for namem and likesPizza.
 *
 * Usage 2:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/prompt.js --name="John"
 * Result: The tool will prompt question for likesPizza but not for the name (it was sent via parameter).
 */

const yargsInteractive = require('../src');

const options = {
  name: {
    type: 'input',
    describe: 'Enter your name',
    prompt: 'if-empty'
  },
  likesPizza: {
    type: 'confirm',
    default: false,
    describe: 'Do you like pizza?'
  },
};

yargsInteractive()
    .usage('$0 <command> [args]')
    .interactive(options)
    .then((result) => {
      console.log(
          `\nResult is:\n`
        + `- Name: ${result.name}\n`
        + `- Likes pizza: ${result.likesPizza}\n`
      );
    });
