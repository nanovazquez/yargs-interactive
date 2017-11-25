const inquirer = require('inquirer');

module.exports = (defaultValues) => {
  const prompt = inquirer.createPromptModule();
  const questions = Object.keys(defaultValues).map((key) => {
    const defaultValue = defaultValues[key];
    return Object.assign({}, defaultValue, {
      name: key,
      type: defaultValue.type,
      message: defaultValue.describe,
      default: defaultValue.default,
      choices: defaultValue.options,
    });
  });

  return prompt(questions);
};
