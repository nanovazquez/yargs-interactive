/**
 * Checks if the argument received is provided in the argument collection
 * @param {Object} arg The arg to check (e.g. `likesPizza`)
 * @param {Object} processArgs The collection of process arguments (e.g. `["--interactive", "--likesPizza=true"]`)
 * @return {boolean} True if the argument is present in the collection of process arguments, false otherwise.
 */
module.exports = (arg, processArgs) => {
  return processArgs.some((argProvided) => argProvided === `--${arg}` || argProvided.startsWith(`--${arg}=`));
};
