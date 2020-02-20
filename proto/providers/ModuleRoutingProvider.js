const express = require('express');
const { Route } = require('../Route');

// ERR: Need to consider how middleware is handled.

function ModuleRoutingProvider() {
  this.router = express.Router();
};

ModuleRoutingProvider.prototype.setModuleName = function start(name) {
  this.moduleName = name;
};

ModuleRoutingProvider.prototype.getModuleName = function start() {
  return this.moduleName;
};

ModuleRoutingProvider.prototype.bindMiddleware = function start(middlewareList) {
  // ERR: Preliminary implementation of applying middleware - VERY EXPERIMENTAL
  Object.values(middlewareList).forEach((v) => {
    this.router
      .use((req, res, next) => {
        v.apply(null, [req, res, next]);
      });
  });
};

ModuleRoutingProvider.prototype.get = function start(route) {
  if (!(route instanceof Route)) {
    throw (new Error('Missing Route argument.'));
  }
  this.router.get(route.getUrl(), (req, res) => {
    route.getHandler().apply(null, [req, res]);
  });
  return true;
};

ModuleRoutingProvider.prototype.post = function start(route) {
  if (!(route instanceof Route)) {
    throw (new Error('Missing Route argument.'));
  }

  this.router.post(route.getUrl(), (req, res) => {
    route.getHandler().apply(null, [req, res]);
  });

  return true;
};

ModuleRoutingProvider.prototype.getRouter = function start() {
  // Return the instance of router
  return this.router;
};

module.exports = { ModuleRoutingProvider };
