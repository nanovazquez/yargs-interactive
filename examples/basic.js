#!/usr/bin/env node

/*
 * Usage:
 * 1) Open a terminal.
 * 2) Enter: node ./examples/basic.js --name='John'
 * 3) Output should have John as name and the default value of likesPizza (false).
 *
 * Alternatives
 * ------------
 * 1) Enter: node ./examples/basic.js --name='John' --likesPizza
 *    Output should have John as name and likesPizza set to true
 * 2) Enter: node ./examples/basic.js
 *    Output should have the default values in all properties.
 * 3) Enter: node ./examples/basic.js --interactive
 *    The tool will prompt questions and will output your answers.
 */

const yargsInteractive = require('../src');

const options = {
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

