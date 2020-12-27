/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const Event = require('./facade/EventFacade');
const Route = require('./RouteFacade');
const Api = require('./ApiFacade');

/* Utils - Returned as tools to use across the program */
const applicationUtils = require('./utils/Application');
const moduleUtils = require('./utils/Module');
const genericUtils = require('./utils/generic');
const taskFactoryManager = require('./utils/TaskFactoryManager');

module.exports = {
  Event,
  Route,
  Api,
  applicationUtils,
  moduleUtils,
  genericUtils,
  taskFactoryManager,
};
