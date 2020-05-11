/* List the requires based on the core structure */

/* Facades - Returned as the respective proto name */
const Event = require('./facade/EventFacade');
const Route = require('./facade/RouteFacade');

/* Utils - Returned as tools to use across the program */
const Application = require('./utils/Application');
const generic = require('./utils/generic');
// const instance = require('./utils/instance');

module.exports = {
  Event,
  Route,
  Application,
  generic,
  // instance,
};
