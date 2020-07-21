const inquirer = require('inquirer');

/**
 * Initiate an interactive prompt to get values from the user.
 * @param {object} values The values to configure the prompt
 * @return {object} A promise that, when fullfilled, will contain answer of the questions prompted to the user
 */
module.exports = (values = {}, inquirerOptions = {}) => {
  const questions = Object.keys(values).map((key) => {
    const value = values[key];
    return Object.assign({}, value, {
      name: key,
      type: value.type,
      message: value.describe,
      default: value.default
    });
  });

  if (inquirerOptions.allowInquirerPlugins) {
    return inquirer.prompt(questions);
  }

  // https://github.com/SBoudrias/Inquirer.js#inquirercreatepromptmodule---prompt-function
  const prompt = inquirer.createPromptModule();

  return prompt(questions);
};
