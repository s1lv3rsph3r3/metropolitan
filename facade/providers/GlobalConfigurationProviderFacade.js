const { GlobalConfigurationProvider } = require('../../proto/providers/GlobalConfigurationProvider');

module.exports = (function start() {
  let INSTANCE;

  const createInstance = () => {
    INSTANCE = new GlobalConfigurationProvider();
    return INSTANCE;
  };

  const getInstance = () => {
    if (!INSTANCE) {
      INSTANCE = createInstance();
    }
    return INSTANCE;
  };

  return {
    getInstance,
  };
}());
