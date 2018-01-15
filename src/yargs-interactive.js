const yargs = require('yargs');
const interactiveMode = require('./interactive-mode');
const filterObject = require('./filter-object');

// Set up yargs options
let yargsInteractive = (processArgs = process.argv.slice(2), cwd) => {
  const yargsConfig = yargs(processArgs, cwd);

  // Add interactive functionality
  yargsConfig.interactive = (options = {}) => {
    // Add interactive option to the ones sent by parameter
    const mergedOptions = Object.assign(
      {},
      options,
      {
        interactive: {
          default: !!(options.interactive && options.interactive.default),
          prompt: false,
        }
      }
    );

    // Run yargs and get the requested arguments
    const argv = yargsConfig
      .options(mergedOptions)
      .argv;

    // Remove options with prompt property explicitly set to false
    const interactiveOptions = filterObject(mergedOptions, (item) => item.prompt !== false);

    // Check if we should get the values from the interactive mode
    return argv.interactive
      ? interactiveMode(interactiveOptions).then((result) => Object.assign({}, argv, result))
      : Promise.resolve(argv);
  };

  return yargsConfig;
};


module.exports = yargsInteractive;
