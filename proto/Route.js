const path = require('path');
const ModuleRouteStore = require('../dictionaries/ModuleRouteStore');

const basePath = path.resolve();

// Global middleware config for the full city
const globalMiddlewareConfigPath = path.resolve(basePath, 'config/middlewares.json');
const globalMiddlewareConfig = require(globalMiddlewareConfigPath);

// Application Modules config
const routeApplicationConfigPath = path.resolve(basePath, 'config/application-modules.json');
const routeApplicationConfig = require(routeApplicationConfigPath);

// Utility functions
const { ConfigParser } = require('../utils/generic');

// Constants used by this class
const orderedOverrideArr = ["global", "module", "type", "verb"];
const acceptedValues = [true, false];
const supportedVerbs = ["get", "post", "put", "delete"];

class Route{
    constructor(calledBy, type) {
        this.type = type;
        this.url = null;
        this.handler = null;
        this.middlewareList = [];
        this.functionCallOrder = {
            "middleware": false,
            "get": false,
            "post": false,
            "put": false,
            "delete": false,
        };
        // TODO: Need to fix the functionCallOrder for when the route is called by the GET,POST,PUT,DELETE functions
        // this.functionCallOrder[calledBy] = true;
        this.verbDict = {
            "get": [],
            "post": [],
            "put": [],
            "delete": []
        }
        this.customArr = [];
    }
    middleware(globalDict, customArr){
        const callingCard = 'middleware';
        const moduleName = ModuleRouteStore.currentKey();
        this.functionCallOrder[callingCard] = true;

        // functionCallOrder should show that all are false
        supportedVerbs.forEach((value, index) => {
            if (this.functionCallOrder[value] !== false){
                throw (new Error(`${value} verb was called prior to calling middleware functionality`));
            }
        })

        if(globalDict === undefined || globalDict === null){
            throw (new Error('globalDict cannot be undefined or null'));
        }
        if(customArr === undefined || customArr === null){
            throw (new Error('customArr cannot be undefined or null'))
        }
        // If the arrays are not of equal length then we assume the function was called with broken arguments
        if(Object.keys(globalDict).length !== orderedOverrideArr.length)
            throw (new Error('Override dictionary does not match correct format'));
        else
        {
            //  Compare the elements in the array in order
            for(let i = 0; i < Object.keys(globalDict).length ; i++){
                if(Object.keys(globalDict)[i] !== orderedOverrideArr[i]) {
                    throw (new Error('Override dictionary does not match correct format'));
                }
            }
        }

        // Only take defined variables
        if(!acceptedValues.includes(globalDict.global)) throw (new Error('global not a boolean'));
        if(!acceptedValues.includes(globalDict.module)) throw (new Error('module not a boolean'));
        if(!acceptedValues.includes(globalDict.type)) throw (new Error('type not a boolean'));
        if(!acceptedValues.includes(globalDict.verb)) throw (new Error('verb not a boolean'));

        if(globalDict.global === true){
            // Global app functions such as bodyParser(), cors(), helmet()
            Object.entries(globalMiddlewareConfig.app).forEach(([key, value], index) => {
                let globalMiddlewarePath = path.resolve(basePath, globalMiddlewareConfig.globDir);
                let fileName = path.resolve(globalMiddlewarePath, key);
                let clazz = require(fileName);
                let tempArr = [];
                value.forEach((functionName) => {
                    tempArr = [...tempArr, ...(clazz[functionName].apply(null))];
                });
                this.middlewareList = [...this.middlewareList, ...tempArr];
            });
            // Custom Global middleware as functions
            Object.entries(globalMiddlewareConfig.custom).forEach(([key, value], index) => {
                let globalMiddlewarePath = path.resolve(basePath, globalMiddlewareConfig.globDir);
                let filename = path.resolve(globalMiddlewarePath, key);
                let clazz = require(filename);
                let tempArr = [];
                value.forEach((functionName) => {
                    tempArr.push(clazz[functionName]);
                });
                this.middlewareList = [...this.middlewareList, ...tempArr];
            })
        }

        if(globalDict.module === true){
            let text = ConfigParser.parseWithEmbeddedVariables( globalMiddlewareConfig.cityConfig, {
                moduleDir: `${routeApplicationConfig.baseDir}`,
                moduleName: `${moduleName}`
            });
            let moduleMiddlewareConfigPath = path.resolve(basePath, text);
            let moduleMiddlewareConfig = require(moduleMiddlewareConfigPath);

            Object.entries(moduleMiddlewareConfig.module).forEach(([key, value], index) => {
                let text = ConfigParser.parseWithEmbeddedVariables(globalMiddlewareConfig.moduleDir, {
                    moduleDir: `${routeApplicationConfig.baseDir}`,
                    moduleName: `${moduleName}`
                });
                let moduleMiddlewarePath = path.resolve(basePath, text);
                let filename = path.resolve(moduleMiddlewarePath, key);
                let clazz = require(filename);
                let tempArr = [];
                value.forEach((functionName) => {
                    tempArr.push(clazz[functionName]);
                });
                this.middlewareList = [...this.middlewareList, ...tempArr];
            });
        }

        if(globalDict.type === true){
            let text = ConfigParser.parseWithEmbeddedVariables(globalMiddlewareConfig.cityConfig, {
                moduleDir: `${routeApplicationConfig.baseDir}`,
                moduleName: `${moduleName}`
            });
            let cityMiddlewareConfigPath = path.resolve(basePath, text);
            let cityMiddlewareConfig = require(cityMiddlewareConfigPath);
            Object.entries(cityMiddlewareConfig[`${this.type}`].umbrella).forEach(([key, value], index) => {
                let text = ConfigParser.parseWithEmbeddedVariables(
                    globalMiddlewareConfig.typeDir, {
                        moduleDir: `${routeApplicationConfig.baseDir}`,
                        moduleName: `${moduleName}`,
                        type: `${this.type}`
                    }
                );
                let typeMiddlewarePath = path.resolve(basePath, text);
                let filename = path.resolve(typeMiddlewarePath, key);
                let clazz = require(filename);
                let tempArr = [];
                value.forEach((functionName) => {
                    tempArr.push(clazz[functionName]);
                });
                this.middlewareList = [...this.middlewareList, ...tempArr];
            });

        }

        if(globalDict.verb === true){
            let text = ConfigParser.parseWithEmbeddedVariables(globalMiddlewareConfig.cityConfig, {
                moduleDir: `${routeApplicationConfig.baseDir}`,
                moduleName: `${moduleName}`
            });
            let cityMiddlewareConfigPath = path.resolve(basePath, text);
            let cityMiddlewareConfig = require(cityMiddlewareConfigPath);
            Object.entries(cityMiddlewareConfig[`${this.type}`].verbs).forEach(([key, value], index) => {
                Object.entries(value).forEach(([k, v], i) => {
                    // for each of the entries in the verb
                    let text = ConfigParser.parseWithEmbeddedVariables(
                        globalMiddlewareConfig.verbDir, {
                            moduleDir: `${routeApplicationConfig.baseDir}`,
                            moduleName: `${moduleName}`,
                            type: `${this.type}`
                        }
                    );
                    let verbMiddlewarePath = path.resolve(basePath, text);
                    let filename = path.resolve(verbMiddlewarePath, k);
                    let clazz = require(filename);
                    v.forEach((functionName) => {
                        this.verbDict[key].push(clazz[functionName]);
                    });
                });
            });
        }

        if(Array.isArray(customArr) && customArr.length){
            customArr.forEach((middleware) => {
                let parts = [];
                switch (typeof(middleware)){
                    case 'function':
                        // Function exists - add to the custom arr
                        this.customArr.push(middleware);
                        break;
                    case 'string':
                        // Parse the string to retrieve correct function from the controller
                        parts = middleware.split('@');
                        let text = ConfigParser.parseWithEmbeddedVariables(
                            globalMiddlewareConfig.customDir, {
                                moduleDir: `${routeApplicationConfig.baseDir}`,
                                moduleName: `${moduleName}`
                            }
                        );
                        const handlerPath = path.resolve(path.resolve(basePath, text), parts[0]);
                        const handler = require(`${handlerPath}`);
                        this.customArr.push(handler[parts[1]]);
                        break;
                    default:
                        // Handler is not defined in a way that can function
                        throw (new Error('Handler function is incorrectly defined.'));
                }
            });
        }
        return this;
    }
    get(path, fn){
        const callingCard = 'get';
        this.modify(path, fn, callingCard);
        return this;
    }
    post(path, fn){
        const callingCard = 'post';
        this.modify(path, fn, callingCard);
        return this;
    }
    put(path, fn){
        const callingCard = 'put';
        this.modify(path, fn, callingCard);
        return this;
    }
    delete(path, fn){
        const callingCard = 'delete';
        this.modify(path, fn, callingCard);
        return this;
    }

    modify(path, fn, callingCard){
        Route.validateRoute(path, fn, this.url, this.functionCallOrder, callingCard);
        this.functionCallOrder[callingCard] = true;
        this.url = path;
        this.handler = fn;
        this.middlewareList = [...this.middlewareList, ...this.verbDict[callingCard]];
        this.middlewareList = [...this.middlewareList, ...this.customArr];
        ModuleRouteStore.add(callingCard, this);
    }

    static validateRoute(path, fn, url, callOrder, callingCard){
        // Check that the middleware has been called
        if(callOrder['middleware'] !== true){
            throw (new Error('Middleware has not been called'));
        }

        // Check that only 1 verb has been called
        supportedVerbs.forEach((verb) => {
            if(callOrder[verb] === true && verb !== callingCard){
                throw (new Error(`Attempting to call ${callingCard} after calling ${verb}`));
            }
        });

        if (path === undefined || path === null) {
            throw (new Error('Missing required arguments.'));
        }

        // If this.url already exists then do not allow altering
        if (url !== undefined && url !== null) {
            throw (new Error('Cannot chain HTTP verbs.'));
        }

        // If the handler is not defined then throw an error
        if (fn === undefined || fn === null) {
            throw (new Error('Missing a handler for route.'));
        }
    }
}
module.exports = Route;
