#!/usr/bin/env node

/*
 * Usage:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/full-interactive.js'
 * 3) The tool will prompt questions and will output your answers.
 */
const yargsInteractive = require('../src');

const options = {
  interactive: {
    default: true,
  },
  name: {
    type: 'input',
    default: 'nano',
    describe: 'Enter your name'
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

