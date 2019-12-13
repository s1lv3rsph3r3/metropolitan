const { BRC487 } = require('@s1lv3rsph3r3/central');
const { Route } = require('../proto/Route');
const ModuleRoutingProvider = require('./providers/ModuleRoutingProviderFacade');
const { ConfigParser } = require('../utils/generic');
const controllerConfig = require(BRC487.commute('config.controllers'));
const moduleConfig = require(BRC487.commute('config.modules'));

// let text = ConfigParser.parseWithEmbeddedVariables(routeConfig.baseDir, { moduleDir: `${moduleConfig.baseDir}`, moduleName: `${moduleName}` });

module.exports = (function start() {
  const get = (path, fn) => {
    if(path === undefined || path === null){
      throw (new Error('Missing URL argument.'));
    }
    if(fn === undefined || fn === null){
      throw (new Error('Missing fn argument.'));
    }
    console.log(typeof(fn));
    switch (typeof(fn)){
      case 'function':
        // do nothing
        console.log('function is function');
        break;
      case 'string':
        // get function from the controller
        console.log('function is string');
        let parts = fn.split('@');
        const moduleName = ModuleRoutingProvider.getInstance().getModuleName();
        // use the controllers config part to define where to get the controllers
        // const text = ConfigParser.parseWithEmbeddedVariables(controllerConfig.baseDir, {});
        // Requires using the root node from the tree
        const absolutePathToBaseProject = BRC487.getAbsolutePathToBaseProject();
        const handler = require(`${absolutePathToBaseProject}/${moduleName}/controllers/http/${parts[0]}`);
        fn = handler[parts[1]];
        break;
      default:
        throw (new Error('Handler function is incorrectly defined.'));
        break;
    }
    // If anything else => throw error
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
