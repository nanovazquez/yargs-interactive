const yargs = require('yargs');
const interactiveMode = require('./interactive-mode');
const filterObject = require('./filter-object');
const isEmpty = require('./is-empty');

// Set up yargs options
let yargsInteractive = (processArgs = process.argv.slice(2), cwd) => {
  const yargsConfig = yargs(processArgs, cwd);

  // Add interactive functionality
  yargsConfig.interactive = (options = {}) => {
    // Merge options sent by parameters with interactive option
    const mergedOptions = Object.assign(
      {},
      options,
      {
        interactive: {
          default: !!(options.interactive && options.interactive.default),
          prompt: 'never',
        }
      }
    );

    // Run yargs with interactive option
    // and get the requested arguments
    const argv = yargsConfig
      .options(mergedOptions)
      .argv;

    // Filter options to prompt based on the "if-empty" property
    const interactiveOptions = filterObject(mergedOptions, (item, key) => {
      // Do not prompt items with prompt value set as "never"
      if (item.prompt === 'never') {
        return false;
      }

      // Prompt items with prompt value set as "always"
      if (item.prompt === 'always') {
        return true;
      }

      // Cases: item.prompt === "if-empty" or item.prompt undefined (fallbacks to "if-empty")
      // Prompt the items that are empty (i.e. a value was not sent via parameter OR doesn't have a default value)
      return isEmpty(argv[key]) && isEmpty(item.default);
    });

    // Check if we should get the values from the interactive mode
    return argv.interactive
      ? interactiveMode(interactiveOptions).then((result) => Object.assign({}, argv, result))
      : Promise.resolve(argv);
  };

  return yargsConfig;
};


module.exports = yargsInteractive;
