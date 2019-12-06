/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const ModuleEventProvider = require('./facade/providers/ModuleEventProviderFacade');
const ModuleRoutingProvider = require('./facade/providers/ModuleRoutingProviderFacade');

const Event = require('./facade/EventFacade');
const Route = require('./facade/RouteFacade');
const GlobalConfiguration = require('./proto/GlobalConfiguration');


/* Utils - Returned as tools to use across the program */
const Application = require('./utils/Application');
const generic = require('./utils/Application');

module.exports = {
    ModuleEventProvider,
    ModuleRoutingProvider,
    GlobalConfiguration,
    Event,
    Route,
    Application,
    generic,
};
