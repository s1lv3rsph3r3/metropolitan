const { ModuleEventProvider } = require('../../proto/providers/ModuleEventProvider');

module.exports = (function start() {
  let INSTANCE;

  const createInstance = () => {
    INSTANCE = new ModuleEventProvider();
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
