const yargs = require('yargs');
const interactiveMode = require('./interactive-mode');
const filterObject = require('./filter-object');

const yargsInteractiveOptions = {
  interactive: {
    describe: 'Use interactive mode',
    default: false,
  },
};

// Set up yargs options
let yargsInteractive = (processArgs = process.argv.slice(2), cwd) => {
  const yargsConfig = yargs(processArgs, cwd);

  // Add interactive functionality
  yargsConfig.interactive = (options = {}) => {
    // Run yargs and get the requested arguments
    const argv = yargsConfig
      .options(yargsInteractiveOptions)
      .options(options)
      .argv;

    // Remove options with prompt property explicitly set to false
    const interactiveOptions = filterObject(options, (item) => item.prompt !== false);

    // Check if we should get the values from the interactive mode
    return argv.interactive
      ? interactiveMode(interactiveOptions).then((result) => Object.assign({}, argv, result))
      : Promise.resolve(argv);
  };

  return yargsConfig;
};


module.exports = yargsInteractive;
