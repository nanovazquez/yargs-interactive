/* eslint-disable camelcase,no-invalid-this */
const {default: test, withAspect} = require('jest-gwt');
const interactiveMode = require('../src/interactive-mode');
const yargsInteractive = require('../src/yargs-interactive');

jest.mock('../src/interactive-mode', () => jest.fn(() => Promise.resolve({})));

describe('yargsInteractive.interactiveOptions', () => {
  withAspect(
      function() {
        this.yargs = yargsInteractive();
      },
      function() {
        delete this.yargs;
        jest.clearAllMocks();
      }
  );

  test('options pass to interactive mode', {
    when: {
      adding_interactive_options,
      prompting_for_options,
    },
    then: {
      interactive_options_are_prompted,
    },
  });

  test('prompted options merge with existing options', {
    given: {
      existing_interactive_options,
    },
    when: {
      adding_interactive_options,
      prompting_for_options,
    },
    then: {
      existing_options_are_prompted,
      interactive_options_are_prompted,
    }
  });

  test('options merge with existing options', {
    given: {
      existing_interactive_options,
    },
    when: {
      overriding_existing_options,
      prompting_for_options,
    },
    then: {
      existing_options_are_OVERRIDDEN,
      interactive_options_are_prompted,
    }
  });

  test('options can be a function', {
    given: {
      existing_interactive_options,
    },
    when: {
      adding_interactive_options_FUNCTION,
      prompting_for_options,
    },
    then: {
      function_given_EXISTING_options,
      function_options_are_prompted,
      existing_options_are_prompted,
      interactive_options_are_prompted,
    }
  });
});

function existing_interactive_options() {
  this.yargs.interactiveOptions({
    existing: {
      prompt: 'always',
      describe: 'existing prompt',
    },
  });
}

function adding_interactive_options() {
  this.yargs.interactiveOptions({
    opt1: {},
  });
}

function prompting_for_options() {
  this.yargs.interactive({
    interactive: {
      default: true,
    },
    prompted: {},
  });
}

function overriding_existing_options() {
  this.yargs.interactiveOptions({
    existing: {
      describe: 'another prompt',
    },
  });
}

function adding_interactive_options_FUNCTION() {
  this.interactiveFunction = jest.fn(() => ({
    fn: {},
  }));
  this.yargs.interactiveOptions(this.interactiveFunction);
}

function existing_options_are_prompted() {
  expect(interactiveMode).toHaveBeenCalledWith(expect.objectContaining({
    existing: {
      describe: 'existing prompt',
      prompt: 'always',
    },
  }));
}

function interactive_options_are_prompted() {
  expect(interactiveMode).toHaveBeenCalledWith(expect.objectContaining({
    prompted: {},
  }));
}

function existing_options_are_OVERRIDDEN() {
  expect(interactiveMode).toHaveBeenCalledWith(expect.objectContaining({
    existing: {
      describe: 'another prompt',
    },
  }));
}

function function_given_EXISTING_options() {
  expect(this.interactiveFunction).toHaveBeenCalledWith({
    existing: {
      describe: 'existing prompt',
      prompt: 'always',
    },
  });
}

function function_options_are_prompted() {
  expect(interactiveMode).toHaveBeenCalledWith(expect.objectContaining({
    fn: {},
  }));
}
