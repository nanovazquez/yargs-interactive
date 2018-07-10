const inquirer = require('inquirer');

module.exports = (values = {}) => {
  const prompt = inquirer.createPromptModule();
  const questions = Object.keys(values).map((key) => {
    const value = values[key];
    return Object.assign({}, value, {
      name: key,
      type: value.type,
      message: value.describe,
      default: value.default,
    });
  });

  return prompt(questions);
};
