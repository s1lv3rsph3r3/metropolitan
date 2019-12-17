const { BRC487 } = require('@s1lv3rsph3r3/central');
const fs = require('fs');
const { ConfigParser } = require('./generic');
const ModuleRoutingProvider = require('../facade/providers/ModuleRoutingProviderFacade');
const ModuleEventProvider = require('../facade/providers/ModuleEventProviderFacade');
const SubscriptionFactory = require('./SubscriptionFactory');

// Route configuration file
const routeConfig = require(BRC487.commute('config.routes'));

// Module configuration file
const moduleConfig = require(BRC487.commute('config.modules'));

const absolutePathToBaseProject = BRC487.getAbsolutePathToBaseProject();

module.exports = (function start() {
  const bootModules = (app) => {
    if (app === undefined || app === null) {
      throw (new Error('Missing app argument.'));
    }

    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {

      const moduleName = value;
      console.log(moduleName);

      /******* MODULE ROUTING ***************/
      // Dispose of ModuleRoutingProvider if it exists
      ModuleRoutingProvider.dispose();

      // Creates a new instance of the ModuleRoutingProvider and sets the name to the current module loading
      ModuleRoutingProvider.setModuleName(moduleName);

      // Generate a list of route files
      const routeFileList = [];
      Object.entries(routeConfig.filename).forEach(([key, value], index) => {
        let text = ConfigParser.parseWithEmbeddedVariables(routeConfig.baseDir, { moduleDir: `${moduleConfig.baseDir}`, moduleName: `${moduleName}` });
        // console.log(text);
        // add the filename on to the entry
        text = `${absolutePathToBaseProject}/${text}${value}`;
        routeFileList.push(text);
      });

      // Require each routing file for the current module namespace
      for (let i = 0; i < routeFileList.length; i++) {
        let text = `${routeFileList[i]}`;
        require(text);
      }

      const namespace = `/${moduleName}`;
      // only use get method from the proto
      const router = ModuleRoutingProvider.getInstance().getRouter();
      app.use(namespace, ModuleRoutingProvider.getInstance().getRouter());
    });

    return true;
  };

  /**************** EVENT ROUTING *****************/
  const bootModuleEvents = () => {
    const filesToInclude = {};
    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {
      const moduleName = value;
      eventsFile = ConfigParser.parseWithEmbeddedVariables(routeConfig.baseDir, { moduleDir: `${moduleConfig.baseDir}`, moduleName: `${moduleName}` });
      eventsFile = `${absolutePathToBaseProject}/${eventsFile}${routeConfig.events}`;
      filesToInclude[moduleName] = eventsFile;
    });

    Object.entries(filesToInclude).forEach(([key, value], index) => {
      require(value);
      SubscriptionFactory.subscribeToAll(ModuleEventProvider.getInstance().getEventList(), key);
    });
  };

  const bindApplicationMiddlewares = (app) => {
    const applicationMiddlewaresConfig = require(BRC487.commute('config.middleware'));
    Object.entries(applicationMiddlewaresConfig.app).forEach( ([key, value], index) => {
      // key is the filename
      // value is the array of functions
      // index is just the index
      // loop through all the values to add to the app
      const stringReq = `${absolutePathToBaseProject}/${applicationMiddlewaresConfig.rootDir}/${key}`;
      const middlewareFile = require(stringReq);
      for(let i = 0; i < value.length; i++){
        app.use((req,res,next) => {
          (middlewareFile[value[i]]).apply(null, [req, res, next]);
        });
      }
    });
    // rootDir -> the location of the middlewares
    // baseDir -> the location of the module spec middlewares
  };

  return {
    bootModules,
    bootModuleEvents,
    bindApplicationMiddlewares,
  };
}());
