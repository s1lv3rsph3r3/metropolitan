const { BRC487 } = require('@s1lv3rsph3r3/central');
const { Route } = require('../proto/Route');
const ModuleRoutingProvider = require('./providers/ModuleRoutingProviderFacade');
const { ConfigParser } = require('../utils/generic');
const controllerConfig = require(BRC487.commute('config.controllers'));
const moduleConfig = require(BRC487.commute('config.modules'));
const routeApplicationConfig = require(BRC487.commute('config.applicationModules'));

module.exports = (function start() {
  const get = (path, fn) => {
    if(path === undefined || path === null){
      throw (new Error('Missing URL argument.'));
    }
    if(fn === undefined || fn === null){
      throw (new Error('Missing fn argument.'));
    }
    switch (typeof(fn)){
      case 'function':
        // Function exists - Do nothing.
        break;
      case 'string':
        // Parse the string to retrieve correct function from the controller
        let parts = fn.split('@');
        const moduleName = ModuleRoutingProvider.getInstance().getModuleName();
        // const text = ConfigParser.parseWithEmbeddedVariables(controllerConfig.baseDir, {});
        const absolutePathToBaseProject = BRC487.getAbsolutePathToBaseProject();
        const handler = require(`${absolutePathToBaseProject}/${routeApplicationConfig.baseDir}/${moduleName}/controllers/http/${parts[0]}`);
        fn = handler[parts[1]];
        break;
      default:
        // Handler is not defined in a way that can function
        throw (new Error('Handler function is incorrectly defined.'));
        break;
    }
    const route = (new Route()).get(path, fn);
    ModuleRoutingProvider.getInstance().get(route);
    return route;
  };

  const post = (path) => {
    if(path === undefined || path === null){
      throw (new Error('Missing URL argument.'));
    };
    const route = (new Route()).post(path);
    ModuleRoutingProvider.getInstance().post(route);
    return route;
  };

  return {
    get,
    post,
  };
}());
