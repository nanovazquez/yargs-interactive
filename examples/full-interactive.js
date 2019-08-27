#!/usr/bin/env node

/*
 * Usage:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/full-interactive.js
 * Result: The tool will prompt questions and will output the answers.
 */
const yargsInteractive = require('../src');

const options = {
  interactive: {
    default: true
  },
  name: {
    type: 'input',
    describe: 'Enter your name'
  },
  likesPizza: {
    type: 'confirm',
    describe: 'Do you like pizza?'
  }
};

yargsInteractive()
    .usage('$0 <command> [args]')
    .interactive(options)
    .then((result) => {
      console.log(`\nResult is:\n` + `- Name: ${result.name}\n` + `- Likes pizza: ${result.likesPizza}\n`);
    });
