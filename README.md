# Yargs Interactive [![Build Status](https://travis-ci.org/nanovazquez/yargs-interactive.svg?branch=master)](https://travis-ci.org/nanovazquez/yargs-interactive) [![Coverage Status](https://coveralls.io/repos/github/nanovazquez/yargs-interactive/badge.svg)](https://coveralls.io/github/nanovazquez/yargs-interactive) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


Interactive (prompt) support for [yargs](https://github.com/yargs/yargs), based on [inquirer](https://github.com/SBoudrias/Inquirer.js/). Useful for using the same CLI for both for humans and non-humans (like CI tools). Also supports mixed mode (yay!).

![Yargs Interactive](./yargs-interactive-logo.png)

This tool helps you to build command line tools without worring to parse arguments or ask them.

## Installation

```
npm install -S yargs-interactive
```

Then, add this code in your CLI code to get all the arguments parsed:

```js
#!/usr/bin/env node
const yargsInteractive = require('yargs-interactive');

yargsInteractive()
  .usage('$0 <command> [args]')
  .interactive(/* pass options here, like */)
  .then((result) => {
      // Arguments will be in the result
      // (e.g. result.name)
    });
});
```

**What type of prompts are supported?** It provides all prompt types supported by [Inquirer](https://github.com/SBoudrias/Inquirer.js/#prompt-types).

> **Note:** See more usage examples [in the examples folder](./examples).

## Usage

It supports the following use cases
* [Full interactive (prompt questions with default values)](#full-interactive-prompt-questions-with-default-values)
* [Prompt just some options (mixed mode)](#prompt-just-some-options-mixed-mode)
* [No prompt at all (ye olde yargs)](#no-prompt-at-all-ye-olde-yargs)

### Full interactive (prompt questions with default values)

**my-cli.js**
```js
const yargsInteractive = require('yargs-interactive');

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
    // The tool will prompt questions and will output your answers.
    // TODO: Do something with the result (e.g result.name)
    console.log(result)
  });
```

**Usage in terminal**
```
➜ node my-cli.js --interactive
```

### Prompt just some options (mixed mode)

You can opt-out options from interactive mode by setting the `prompt` property to `false`.

**my-cli.js**
```js
const yargsInteractive = require('yargs-interactive');

const options = {
  name: {
    type: 'input',
    name: 'nano',
    describe: 'Enter your name'
  },
  likesPizza: {
    type: 'confirm',
    default: false,
    describe: 'Do you like pizza?',
    prompt: false // because everyone likes pizza
  },
};

yargsInteractive()
  .usage('$0 <command> [args]')
  .interactive(options)
  .then((result) => {
    // The tool will prompt questions for all options and will output your answers.
    // You can opt-out options by using `prompt: false`. For these properties, it
    // will use the value sent by parameter (--likesPizza) or the default value.
    // TODO: Do something with the result (e.g result.name)
    console.log(result);
  });
```

**Usage in terminal**
```
➜ node my-cli.js --name='Johh' --interactive
```

### No prompt at all (ye olde yargs)

**my-cli.js**
```js
const yargsInteractive = require('yargs-interactive');

const options = {
  name: {
    type: 'input',
    name: 'nano',
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
    // The tool will output the values set via parameters or
    // the default value (if not provided).
    // TODO: Do something with the result (e.g result.name)
    console.log(result);
  });
```

**Usage in terminal**
```
➜ node my-cli.js --name='Johh' --likesPizza
```
