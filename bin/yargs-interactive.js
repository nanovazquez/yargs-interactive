#! /usr/bin/env node

const yargs = require('yargs');
const interactiveMode = require('../src/interactive-mode');

const yargsInteractiveOptions = {
  interactive: {
    describe: 'Use interactive mode',
    default: false,
  },
};

// Set up yargs options
let yargsInteractive = (processArgs, cwd) => {
  const yargsConfig = yargs(processArgs, cwd)
    .options(yargsInteractiveOptions);

  // Add interactive functionality
  yargsConfig.interactive = (options = {}) => {
    // Run yargs and get the requested arguments
    const argv = yargsConfig
      .options(options)
      .argv;

    // Check if we should get the values from the interactive mode
    return argv.interactive
      ? interactiveMode(options).then((result) => Object.assign({}, argv, result))
      : Promise.resolve(argv);
  };

  return yargsConfig;
};


module.exports = yargsInteractive;
