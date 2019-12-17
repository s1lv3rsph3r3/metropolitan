const ConfigParser = (function start() {

  // ERR: This will fall over if all the keys are not defined in valueObj
  const parseWithEmbeddedVariables = (expression, valueObj) => {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    const text = expression.replace(templateMatcher, (substring, key) => {
      const value = valueObj[key];
      return value;
    });
    return text;
  };

  return {
    parseWithEmbeddedVariables,
  };
}());

module.exports = {
  ConfigParser,
};
