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

  const dispose = () => {
    // set to null or delete
    if(INSTANCE){
      INSTANCE = undefined;
      return true;
    }
    return false;
  };

  const setModuleName = (name) => {
    if(INSTANCE){
      throw (new Error('Cannot set the module name on an already existing INSTANCE.'));
    }
    INSTANCE = createInstance();
    INSTANCE.setModuleName(name);
    return true;
  }

  return {
    getInstance,
    dispose,
    setModuleName,
  };
}());
