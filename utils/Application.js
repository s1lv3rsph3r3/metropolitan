const fs = require('fs');
const { ConfigParser } = require('./generic');
const ModuleRoutingProvider = require('../facade/providers/ModuleRoutingProviderFacade');
const ModuleEventProvider = require('../facade/providers/ModuleEventProviderFacade');

// Route configuration file
const routeConfig = require('./config/routes.json');

// Module configuration file
const moduleConfig = require('./config/modules.json');

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
        text = `./${text}${value}`;
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

  const bootModuleEvents = () => {
    // iterate through the modules and require the events
    /**************** EVENT ROUTING *****************/
    // this should be to require the events file
    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {
      
      const moduleName = value;
      console.log(moduleName);
      eventsFile = ConfigParser.parseWithEmbeddedVariables(routeConfig.baseDir, { moduleDir: `${moduleConfig.baseDir}`, moduleName: `${moduleName}` });
      eventsFile = `./${eventsFile}${routeConfig.events}`;
      require(eventsFile);
    });

    for(let i = 0; i < (ModuleEventProvider.getInstance()).getEventList().length; i++){
      console.log(ModuleEventProvider.getInstance().getEventList()[i].channel);
    }
  };

  const bindApplicationMiddlewares = (app) => {
    const applicationMiddlewaresConfig = require('./config/middleware.json');
    Object.entries(applicationMiddlewaresConfig.app).forEach( ([key, value], index) => {
      // key is the filename
      // value is the array of functions
      // index is just the index
      // loop through all the values to add to the app
      const stringReq = `${applicationMiddlewaresConfig.rootDir}/${key}`;
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
