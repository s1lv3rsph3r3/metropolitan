const path = require('path');
const ModuleRouteStore = require('../dictionaries/ModuleRouteStore');
const { ConfigParser } = require('../utils/generic');
const Route = require('../proto/Route');
const basePath = path.resolve();
const controllerConfigPath = path.resolve(basePath, 'config/controllers.json');
const controllerConfig = require(controllerConfigPath);
const moduleConfigPath = path.resolve(basePath, 'config/modules.json');
const moduleConfig = require(moduleConfigPath);
const routeApplicationConfigPath = path.resolve(basePath, 'config/applicationModules.json');
const routeApplicationConfig = require(routeApplicationConfigPath);

const defaultGlobalDict = {
    "global": true,
    "module": true,
    "type": true,
    "verb": true
};
const type = 'web';

class RouteFacade{
    static middleware(globalDict, customArr){
        const callingCard = 'middleware';
        return (new Route(callingCard, type)).middleware(globalDict, customArr);
    }
    static get(path, fn){
        const callingCard = 'get';
        RouteFacade.validateFacadeArgs(path, fn);
        const func = RouteFacade.parseFunction(fn);
        return (new Route(callingCard, type)).middleware(defaultGlobalDict, []).get(path, func);
    }
    static post(path, fn){
        const callingCard = 'post';
        RouteFacade.validateFacadeArgs(path, fn);
        const func = RouteFacade.parseFunction(fn);
        return (new Route(callingCard, type)).middleware(defaultGlobalDict, []).post(path, func);
    }
    static put(path, fn){
        const callingCard = 'put';
        RouteFacade.validateFacadeArgs(path, fn);
        const func = RouteFacade.parseFunction(fn);
        return (new Route(callingCard).middleware(defaultGlobalDict, []).put(path, func));
    }
    static delete(path, fn){
        const callingCard = 'delete';
        RouteFacade.validateFacadeArgs(path, fn);
        const func = RouteFacade.parseFunction(fn);
        return (new Route(callingCard, type)).middleware(defaultGlobalDict, []).delete(path, func);
    }

    static validateFacadeArgs(path, fn){
        if(path === undefined || path === null){
            throw (new Error('Missing URL argument.'));
        }
        if(fn === undefined || fn === null){
            throw (new Error('Missing fn argument.'));
        }
        return true;
    }

    static parseFunction(fn){
        let moduleName = ModuleRouteStore.currentKey();
        let parts = [];
        switch (typeof(fn)){
            case 'function':
                // Function exists - Do nothing.
                break;
            case 'string':
                // Parse the string to retrieve correct function from the controller
                parts = fn.split('@');
                const handler = require(`${basePath}/${routeApplicationConfig.baseDir}/${moduleName}/controllers/http/${parts[0]}`);
                fn = handler[parts[1]];
                break;
            default:
                // Handler is not defined in a way that can function
                throw (new Error('Handler function is incorrectly defined.'));
        }
        return fn;
    }
}

module.exports = RouteFacade;
