#!/usr/bin/env node

/*
 * Usage:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/mixed-mode.js --interactive
 * Result: The tool will prompt a question for the name but not for the likesPizza property (it will use the default value instead).
 */

const yargsInteractive = require('../src');

const options = {
  name: {
    type: 'input',
    describe: 'Enter your name'
  },
  likesPizza: {
    type: 'confirm',
    default: true,
    describe: 'Do you like pizza?',
    prompt: 'never' // because everyone likes pizza
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
