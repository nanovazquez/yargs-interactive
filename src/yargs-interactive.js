const yargs = require('yargs');
const interactiveMode = require('./interactive-mode');
const filterObject = require('./filter-object');
const isEmpty = require('./is-empty');
const isArgProvided = require('./is-args-provided');

// Set up yargs options
const yargsInteractive = (processArgs = process.argv.slice(2), cwd) => {
  const yargsConfig = yargs(processArgs, cwd);

  // Add interactive functionality
  yargsConfig.interactive = (options = {}) => {
    // Merge options sent by parameters with interactive option
    const mergedOptions = Object.assign({}, options, {
      interactive: {
        type: 'confirm',
        default: !!(options.interactive && options.interactive.default) || !!yargs.argv.interactive,
        prompt: 'never'
      }
    });

    // Run yargs with interactive option
    // and get the requested arguments
    const argv = yargsConfig.options(mergedOptions).argv;

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

      // Prompt items that are set with 'if-no-arg' and values were not send via command line parameters
      if (item.prompt === 'if-no-arg') {
        return !isArgProvided(key, processArgs);
      }

      // Cases: item.prompt === "if-empty" or item.prompt undefined (fallbacks to "if-empty")
      // Prompt the items that are empty (i.e. a value was not sent via parameter OR doesn't have a default value)
      return isEmpty(argv[key]) && isEmpty(item.default);
    });

    // Assess self-contained mode -- Wheteher to create a self contained inquirer module or allow other libraries to be usable.
    const inquirerOptions = {
      allowInquirerPlugins: !!(options.interactive && options.interactive.allowInquirerPlugins)
    };

    // Check if we should get the values from the interactive mode
    return argv.interactive ? interactiveMode(interactiveOptions, inquirerOptions).then((result) => Object.assign({}, argv, result)) : Promise.resolve(argv);
  };

  return yargsConfig;
};

module.exports = yargsInteractive;
