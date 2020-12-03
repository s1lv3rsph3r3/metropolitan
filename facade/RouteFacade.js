const path = require('path');
const { Route } = require('../proto/Route');
const ModuleRoutingProvider = require('./providers/ModuleRoutingProviderFacade');
const { ConfigParser } = require('../utils/generic');
const basePath = path.resolve();
const controllerConfigPath = path.resolve(basePath, 'config/controllers.json');
const controllerConfig = require(controllerConfigPath);
const moduleConfigPath = path.resolve(basePath, 'config/modules.json');
const moduleConfig = require(moduleConfigPath);
const routeApplicationConfigPath = path.resolve(basePath, 'config/applicationModules.json');
const routeApplicationConfig = require(routeApplicationConfigPath);

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
        const absolutePathToBaseProject = basePath;
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

  const post = (path, fn) => {
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
        const absolutePathToBaseProject = basePath;
        const handler = require(`${absolutePathToBaseProject}/${routeApplicationConfig.baseDir}/${moduleName}/controllers/http/${parts[0]}`);
        fn = handler[parts[1]];
        break;
      default:
        break;
    }
    const route = (new Route()).post(path, fn);
    ModuleRoutingProvider.getInstance().post(route);
    return route;
  };

  return {
    get,
    post,
  };
}());
