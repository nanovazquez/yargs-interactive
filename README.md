# Yargs Interactive

Interactive (prompt) support for [yargs](https://github.com/yargs/yargs), based on [inquirer](https://github.com/SBoudrias/Inquirer.js/)

It supports the following use cases
* [Full interactive](#full-interactive)
* [Prompt just for some options](#prompt-just-for-some-options)
* [No prompt at all (ye olde yargs)](#no-prompt-at-all-ye-olde-yargs)

## Installation

```
npm install -S yargs-interactive
```

Then, add this code in your CLI code to get all the arguments parsed:

```
#!/usr/bin/env node
const yargsInteractive = require('yargs-interactive');

yargsInteractive
  .usage('$0 <command> [args]')
  .interactive(/* pass options here */)
  .then((result) => {
      // Use your arguments here
    });
});
```

## Full interactive

TBC

What type of prompts are supported? All prompt types supported by [Inquirer](https://github.com/SBoudrias/Inquirer.js/#prompt-types).

## Prompt just for some options

TBC

## No prompt at all (ye olde yargs)

TBC
