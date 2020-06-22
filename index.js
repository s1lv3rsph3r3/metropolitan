/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const Event = require('./facade/EventFacade');
const Route = require('./facade/RouteFacade');
const Api = require('./facade/RouteFacade');

/* Utils - Returned as tools to use across the program */
const applicationUtils = require('./utils/Application');
const genericUtils = require('./utils/generic');

module.exports = {
  Event,
  Route,
  Api,
  applicationUtils,
  genericUtils,
};
