const ConfigParser = (function start() {

  // this function should only apply to keys that are well defined
  // (undefined should not alter the expression)
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
