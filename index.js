/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const ModuleEventProvider = require('./facade/providers/ModuleEventProviderFacade');
const ModuleRoutingProvider = require('./facade/providers/ModuleRoutingProviderFacade');

const Event = require('./facade/EventFacade');
const Route = require('./facade/RouteFacade');

/* Utils - Returned as tools to use across the program */
const Application = require('./utils/Application');
const generic = require('./utils/generic');
const instance = require('./utils/instance');
const SubscriptionFactory = require('./utils/SubscriptionFactory');

module.exports = {
  ModuleEventProvider,
  ModuleRoutingProvider,
  Event,
  Route,
  Application,
  generic,
  instance,
  SubscriptionFactory,
};
