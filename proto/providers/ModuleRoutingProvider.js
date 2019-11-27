const express = require('express');
const { Route } = require('../Route');

const Middleware = require('../application_modules/admin/middlewares/TestMiddleware');

// Need to take into consideration middleware

// Options for Middleware
// > Middleware can be declared at a modular level
// > Middleware can be declared at an application level ?? ( Probably Unecessary )
// > Middleware can be declared at a route specific option
// > Middleware can be declared at a grouping level
// > How do you group routes?

function ModuleRoutingProvider() {
  this.router = express.Router();

  // ModuleRoutingProvider should have some context of the booting module

  // this.router.use((req, res, next) => {
  //   console.log('Time: ', Date.now());
  //   next();
  // }, (req, res, next) => {
  //   console.log('This is the next function');
  //   next();
  // }, (req, res, next) => {
  //   console.log('This is the last function');
  //   next();
  // });
  this.bindMiddleware(Middleware);
};

ModuleRoutingProvider.prototype.setModuleName = function start(name){
  this.moduleName = name;
}

ModuleRoutingProvider.prototype.getModuleName = function start(){
  return this.moduleName;
}

ModuleRoutingProvider.prototype.bindMiddleware = function start(middlewareList){
  // this should bind the middleware;
  // for each of the middleware functions for the module - bind to the router;
  // this needs direct access to the listing of the file directories
  Object.entries(Middleware).forEach(([key, value], index) => {
    //console.log(key, value, index);
    this.router
    .use((req, res, next) => {
      value.apply(null, [req, res, next]);
    });
  });
}

ModuleRoutingProvider.prototype.get = function start(route) {
  if(!(route instanceof Route)){
      throw (new Error('Missing Route argument.'));
    };
    this.router.get(route.getUrl(), function(req, res){
      route.getHandler().apply(null, [req, res]);
    });
    return true;
};

ModuleRoutingProvider.prototype.post = function start(route) {
  if(!(route instanceof Route)){
    throw (new Error('Missing Route argument.'));
  };
  this.router.post(route.getUrl(), function (req, res){
    console.log('this is the route');
  });
  return true;
};

ModuleRoutingProvider.prototype.getRouter = function start(route){
  // get the instance of the router
  return this.router;
}

module.exports = { ModuleRoutingProvider };
