/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const Event = require('./facade/EventFacade');
const Route = require('./facade/RouteFacade');

/* Utils - Returned as tools to use across the program */
const applicationUtils = require('./utils/Application');
const genericUtils = require('./utils/generic');
// const instance = require('./utils/instance');

module.exports = {
  Event,
  Route,
  applicationUtils,
  genericUtils,
  // instance,
};
