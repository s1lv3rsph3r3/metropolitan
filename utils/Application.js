const express = require('express');
const path = require('path');
const { ConfigParser } = require('./generic');
const ModuleRouteStore = require('../dictionaries/ModuleRouteStore');
const ModuleRoutingProvider = require('../facade/providers/ModuleRoutingProviderFacade');
const ModuleEventProvider = require('../facade/providers/ModuleEventProviderFacade');
const SubscriptionFactory = require('./SubscriptionFactory');
const basePath = path.resolve();
// Route configuration file
const routeConfigPath = path.resolve(basePath, 'config/routes.json');
const routeConfig = require(routeConfigPath);

// Base Module configuration file
const baseModuleConfigPath = path.resolve(basePath, 'config/modules.json');
const baseModuleConfig = require(baseModuleConfigPath);

// Application modules configuration file
const applicationModulesConfigPath = path.resolve(basePath, 'config/applicationModules.json');
const applicationModulesConfig = require(applicationModulesConfigPath);

const absolutePathToBaseProject = basePath;

// console.log(path.resolve(absolutePathToBaseProject, baseModuleConfig.install))
// Module configuration file
const moduleConfig = require(path.resolve(absolutePathToBaseProject, baseModuleConfig.install));

module.exports = (function start() {

  /******* MODULE ROUTING ***************/
      // const bootWebRoutes = (app) => {
      //   if (app === undefined || app === null) {
      //     throw (new Error('Missing app argument.'));
      //   }
      //   console.log(moduleConfig);
      //   Object.values(moduleConfig.install).forEach((value) => {
      //     console.log(value);
      //     // value is the moduleName
      //     const moduleName = value;
      //
      //     // Dispose of ModuleRoutingProvider if it exists
      //     ModuleRoutingProvider.dispose();
      //
      //     // Creates a new instance of the ModuleRoutingProvider and sets the name to the current module loading
      //     ModuleRoutingProvider.setModuleName(moduleName);
      //
      //     // Generate a list of route files
      //     // const routeFileList = [];
      //     // Object.entries(routeConfig.filename).forEach(([key, value], index) => {
      //     let text = ConfigParser.parseWithEmbeddedVariables(
      //         routeConfig.baseDir,
      //         { moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}` }
      //     );
      //
      //     // Add to the list of route files to require
      //     text = `${absolutePathToBaseProject}/${text}${routeConfig.routes}`;
      //     //  routeFileList.push(text);
      //     // });
      //
      //     // Require each routing file for the current module namespace
      //     // for (let i = 0; i < routeFileList.length; i++) {
      //     // let text = `${routeFileList[i]}`;
      //     require(text);
      //     // }
      //
      //     const namespace = `/${moduleConfig.modules[moduleName].slug}`;
      //     const router = ModuleRoutingProvider.getInstance().getRouter();
      //     app.use(namespace, ModuleRoutingProvider.getInstance().getRouter());
      //   });
      //
      //   return true;
      // };

  const bootWebRoutes = (app) => {
        // Sanity check on the express app
        if (app === undefined || app === null) {
          throw (new Error('Missing app argument.'));
        }
        Object.values(moduleConfig.install).forEach((value) => {

          // For each of the modules we do the following
          // call ModuleRouteStore.next(k) on the module
          // Then we require the file

          // Then consider applying middleware to a router and loading the routers

          const moduleName = value;

          ModuleRouteStore.next(moduleName);

          let text = ConfigParser.parseWithEmbeddedVariables(
              routeConfig.baseDir,
              { moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}` }
          );

          // Add to the list of route files to require
          text = `${absolutePathToBaseProject}/${text}${routeConfig.routes}`;

          require(text);
        });

        Object.entries(ModuleRouteStore.get()).forEach(([key, value], index) => {
          // console.log(key, value, index);
          const moduleName = key;
          // key is the module name
          // Value is object for all methods
          // value is the array of all the routes
          // Create an express router
          let router = express.Router();

          value.get.forEach((route) => {
            router.get(route.url, route.middlewareList, (req, res) => {
              route.handler.apply(null, [req, res]);
            });
          });

          value.post.forEach((route) => {
            router.post(route.url, route.middlewareList, (req, res) => {
              route.handler.apply(null, [req, res]);
            });
          });

          value.put.forEach((route) => {
            router.put(route.url, route.middlewareList, (req, res) => {
              route.handler.apply(null, [req, res]);
            });
          });

          value.delete.forEach((route) => {
            router.delete(route.url, route.middlewareList, (req, res) => {
              route.handler.apply(null, [req, res]);
            });
          });

          const namespace = `/${baseModuleConfig.modules[moduleName].slug}`;
          // In here we need to apply routes and middleware
          app.use(namespace, router);
        });

        return true;
      };

  /******* API ROUTING ***************/
  const bootApiRoutes = (app) => {
    // Sanity check on the express app
    if (app === undefined || app === null) {
      throw (new Error('Missing app argument.'));
    }
    Object.values(moduleConfig.install).forEach((value) => {

      // For each of the modules we do the following
      // call ModuleRouteStore.next(k) on the module
      // Then we require the file

      // Then consider applying middleware to a router and loading the routers

      const moduleName = value;

      ModuleRouteStore.next(moduleName);

      let apiFile = ConfigParser.parseWithEmbeddedVariables(
          routeConfig.baseDir,
          {moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}`}
      );
      apiFile = `${absolutePathToBaseProject}/${apiFile}${routeConfig.api.filename}`;

      require(apiFile);
    });

    Object.entries(ModuleRouteStore.get()).forEach(([key, value], index) => {
      // console.log(key, value, index);
      const moduleName = key;
      // key is the module name
      // Value is object for all methods
      // value is the array of all the routes
      // Create an express router
      let router = express.Router();

      value.get.forEach((route) => {
        router.get(route.url, route.middlewareList, (req, res) => {
          route.handler.apply(null, [req, res]);
        });
      });

      value.post.forEach((route) => {
        router.post(route.url, route.middlewareList, (req, res) => {
          route.handler.apply(null, [req, res]);
        });
      });

      value.put.forEach((route) => {
        router.put(route.url, route.middlewareList, (req, res) => {
          route.handler.apply(null, [req, res]);
        });
      });

      value.delete.forEach((route) => {
        router.delete(route.url, route.middlewareList, (req, res) => {
          route.handler.apply(null, [req, res]);
        });
      });

      // this should be defined in the api config json
      const apiNamespace = `/${routeConfig.api.prefix}/v${routeConfig.api.version}/`;
      const namespace = `${apiNamespace}${baseModuleConfig.modules[moduleName].slug}`;
      // In here we need to apply routes and middleware
      app.use(namespace, router);
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
    Object.values(moduleConfig.install).forEach((value) => {

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
      // TODO: Change namespace to use a slug rather than camel case - maybe??
      SubscriptionFactory.subscribeToAll(ModuleEventProvider.getInstance().getEventList(), moduleName);
    });
  };

  /*************** Micro Service City **********/
  const bootModulePreReq = () => {
    Object.values(moduleConfig.install).forEach((value) => {

      const moduleName = value;

      let bootloader = ConfigParser.parseWithEmbeddedVariables(
          applicationModulesConfig.main,
          {moduleDir: `${applicationModulesConfig.baseDir}`, moduleName: `${moduleName}`, moduleMain: `${baseModuleConfig.main}`}
      );
      bootloader = `${absolutePathToBaseProject}/${bootloader}`;
      require(bootloader);
    });
  };

  /**************** MIDDLEWARE *****************/
      // ERR: This is very experimental - requires more work
  // const bindApplicationMiddlewares = (app) => {
  //       const applicationMiddlewaresConfigPath = path.resolve(basePath, 'config/middlewares.json');
  //       const applicationMiddlewaresConfig = require(applicationMiddlewaresConfigPath);
  //       Object.entries(applicationMiddlewaresConfig.app).forEach( ([key, value], index) => {
  //         // key is the filename
  //         // value is the array of functions
  //         // index is just the index
  //         // loop through all the values to add to the app
  //         const stringReq = `${absolutePathToBaseProject}/${applicationMiddlewaresConfig.rootDir}/${key}`;
  //         const middlewareFile = require(stringReq);
  //         for(let i = 0; i < value.length; i++){
  //           app.use((req,res,next) => {
  //             (middlewareFile[value[i]]).apply(null, [req, res, next]);
  //           });
  //         }
  //       });
  //       // rootDir -> the location of the middlewares
  //       // baseDir -> the location of the module spec middlewares
  //     };

  // Official Global Middleware
  // -> Do the following
  // -> Standard Middleware is applied on the express app immediately
  // -> Custom logic functions are applied in order
  // const bootGlobalMiddleware = (app) => {
  //   // This should just take the bindMiddlewares function and use this to call the middleware functionality
  //   // const applicationMiddlewaresConfig = require(BRC487.commute('config.middleware'));
  //   const applicationMiddlewaresConfigPath = path.resolve(basePath, 'config/middlewares.json');
  //   const applicationMiddlewaresConfig = require(applicationMiddlewaresConfigPath);
  //
  //   // This should distinguish between the app middleware which requires an expressApp
  //   Object.entries(applicationMiddlewaresConfig.app).forEach(([key, value], index) => {
  //     // key is the filename
  //     // value is the array of functions
  //     // index is just the index
  //     // loop through all the values to add to the app
  //     console.log(key, value, index);
  //     const stringReq = `${absolutePathToBaseProject}`;
  //     const pathToFile = path.resolve(stringReq,`${applicationMiddlewaresConfig.rootDir}/${key}`);
  //     const middlewareFile = require(pathToFile);
  //     for(let i = 0; i < value.length; i++){
  //       (middlewareFile[value[i]]).apply(null, [app]);
  //     }
  //   });
  //
  //   // This should also distinguish between the custom middleware which takes (req, res, next)
  //   // This should distinguish between the app middleware which requires an expressApp
  //   Object.entries(applicationMiddlewaresConfig.custom).forEach(([key, value], index) => {
  //     // key is the filename
  //     // value is the array of functions
  //     // index is just the index
  //     // loop through all the values to add to the app
  //     console.log(key, value, index);
  //     const stringReq = `${absolutePathToBaseProject}`;
  //     const pathToFile = path.resolve(stringReq,`${applicationMiddlewaresConfig.rootDir}/${key}`);
  //     const middlewareFile = require(pathToFile);
  //     for(let i = 0; i < value.length; i++){
  //       app.use((req, res, next) => {
  //         (middlewareFile[value[i]]).apply(null, [req, res, next]);
  //       });
  //     }
  //   });
  // }

  return {
    bootWebRoutes,
    bootApiRoutes,
    bootModuleEvents,
    bootModulePreReq,
    // bindApplicationMiddlewares,
    // bootGlobalMiddleware,
  };
}());
