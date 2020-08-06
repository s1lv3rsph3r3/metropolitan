module.exports = (() => {
    const taskFactoryManagerMapping = {};
    // TODO: Validation to prevent a key from being overwritten by the creation of a new task instance
    const put = (key, value) => {
        taskFactoryManagerMapping[key] = value;
    };
    const get = (key) => {
        return taskFactoryManagerMapping[key];
    };
    return {
      put,
      get,
    };
})();