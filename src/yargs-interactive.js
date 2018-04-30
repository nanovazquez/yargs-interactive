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

    // Remove options with prompt value set to 'never'
    // and options with prompt value set to 'if-empty' but no default value or value set via parameter
    const interactiveOptions = filterObject(mergedOptions, (item, key) => (
      item.prompt !== 'never'
      && (item.prompt !== 'if-empty' || isEmpty(item.default) || isEmpty(argv[key]))
    ));

    // Check if we should get the values from the interactive mode
    return argv.interactive
      ? interactiveMode(interactiveOptions).then((result) => Object.assign({}, argv, result))
      : Promise.resolve(argv);
  };

  return yargsConfig;
};


module.exports = yargsInteractive;
