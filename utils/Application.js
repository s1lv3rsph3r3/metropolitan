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

// Application modules configuration file
const applicationModulesConfig = require(BRC487.commute('config.applicationModules'));

const absolutePathToBaseProject = BRC487.getAbsolutePathToBaseProject();

module.exports = (function start() {

  /******* MODULE ROUTING ***************/
  const bootWebRoutes = (app) => {
    if (app === undefined || app === null) {
      throw (new Error('Missing app argument.'));
    }

    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {

      const moduleName = value;

      // Dispose of ModuleRoutingProvider if it exists
      ModuleRoutingProvider.dispose();

      // Creates a new instance of the ModuleRoutingProvider and sets the name to the current module loading
      ModuleRoutingProvider.setModuleName(moduleName);

      // Generate a list of route files
      // const routeFileList = [];
      // Object.entries(routeConfig.filename).forEach(([key, value], index) => {
        let text = ConfigParser.parseWithEmbeddedVariables(
          routeConfig.baseDir,
          { moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}` }
        );

        // Add to the list of route files to require
        text = `${absolutePathToBaseProject}/${text}${routeConfig.routes}`;
      //  routeFileList.push(text);
      // });

      // Require each routing file for the current module namespace
      // for (let i = 0; i < routeFileList.length; i++) {
        // let text = `${routeFileList[i]}`;
        require(text);
      // }

      const namespace = `/${moduleName}`;
      const router = ModuleRoutingProvider.getInstance().getRouter();
      app.use(namespace, ModuleRoutingProvider.getInstance().getRouter());
    });

    return true;
  };

  /******* API ROUTING ***************/
  const bootApiRoutes = (app) => {
    if (app === undefined || app === null) {
      throw (new Error('Missing app argument.'));
    }

    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {

      const moduleName = value;

      // Dispose of ModuleRoutingProvider if it exists
      ModuleRoutingProvider.dispose();

      // Creates a new instance of the ModuleRoutingProvider and sets the name to the current module loading
      ModuleRoutingProvider.setModuleName(moduleName);

      // Build an absolute path to events file using configuration settings
      // ERR: This makes an assumption that the module only has one events file!
      let apiFile = ConfigParser.parseWithEmbeddedVariables(
          routeConfig.baseDir,
          {moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}`}
      );
      apiFile = `${absolutePathToBaseProject}/${apiFile}${routeConfig.api.filename}`;
      //filesToInclude[moduleName] = eventsFile;

      // For each module with a relevant events file we subscribe to the events
      // Object.entries(filesToInclude).forEach(([key, value], index) => {

      // Requiring the events file builds the ModuleEventProvider with the list of events
      require(apiFile);


      // this should be defined in the api config json
      const apiNamespace = `/${routeConfig.api.prefix}/v${routeConfig.api.version}/`;
      const namespace = `${apiNamespace}${moduleName}`;
      const router = ModuleRoutingProvider.getInstance().getRouter();
      app.use(namespace, ModuleRoutingProvider.getInstance().getRouter());
    });

    return true;
  };

  /**************** EVENT ROUTING *****************/
  const bootModuleEvents = () => {
    //const filesToInclude = {};
    // foreach module in production listing do the following
    //  > Grab the moduleName
    //  > Get the events files bound to the module

    // foreach file in the list of files do the following
    //  > Require the file - > using the facade this will add to the list in ModuleEventProvider
    //  > Use the subscription factory to bind the listeners
    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {

      const moduleName = value;

      // Dispose of ModuleEventProvider if it exists
      ModuleEventProvider.dispose();

      // Creates a new instance of the ModuleEventProvider and sets the name to the current module
      ModuleEventProvider.setModuleName(moduleName);

      // Build an absolute path to events file using configuration settings
      // ERR: This makes an assumption that the module only has one events file!
      let eventsFile = ConfigParser.parseWithEmbeddedVariables(
          routeConfig.baseDir,
          {moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}`}
      );
      eventsFile = `${absolutePathToBaseProject}/${eventsFile}${routeConfig.events}`;
      //filesToInclude[moduleName] = eventsFile;

      // For each module with a relevant events file we subscribe to the events
      // Object.entries(filesToInclude).forEach(([key, value], index) => {

      // Requiring the events file builds the ModuleEventProvider with the list of events
      require(eventsFile);

      // SubscriptionFactory is responsible for listening to all listed events
      SubscriptionFactory.subscribeToAll(ModuleEventProvider.getInstance().getEventList(), moduleName);
    });
  };

  /*************** Micro Service City **********/
  const bootModulePreReq = () => {
    Object.entries(moduleConfig.modules.production).forEach(([key, value], index) => {

      const moduleName = value;

      let bootloader = ConfigParser.parseWithEmbeddedVariables(
          applicationModulesConfig.main,
          {moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}`, moduleMain: `${moduleConfig.main}`}
      );
      bootloader = `${absolutePathToBaseProject}/${bootloader}`;
      require(bootloader);
    });
  };

  /**************** MIDDLEWARE *****************/
  // ERR: This is very experimental - requires more work
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
    bootWebRoutes,
    bootApiRoutes,
    bootModuleEvents,
    bootModulePreReq,
    bindApplicationMiddlewares,
  };
}());
