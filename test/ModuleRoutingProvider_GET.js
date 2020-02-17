const { assert, expect } = require('chai');
const path = require('path');
const fs = require('fs');
const express = require('express');
const Router = express.Router();

// ModuleRoutingProvider Test for GET verb
describe('ModuleRoutingProvider Test for GET verb', function () {

let ModuleRoutingProviderFacade;
let ModuleRoutingProvider;
let RouteFacade;

  before(function(){
    const configPath = './testing_components/config_example_2';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config`);
    ModuleRoutingProviderFacade = require('../facade/providers/ModuleRoutingProviderFacade');
    ModuleRoutingProvider = require('../proto/providers/ModuleRoutingProvider').ModuleRoutingProvider;
    RouteFacade = require('../facade/RouteFacade');
  });

  after(function(){
    const configPath = './testing_components/config';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config_example_2`);
  });

  // ModuleRoutingProvider should be singleton

  // ModuleRoutingProvider should return an instance of Object
  it('should be an instance of Object', function () {
    assert.instanceOf(ModuleRoutingProviderFacade, Object, 'ModuleRoutingProvider is an instance of Object');
  });

  // ModuleRoutingProvider should be of type Function
  it('should be a type of Function', function () {
    assert.equal(typeof(ModuleRoutingProviderFacade), 'object', 'ModuleRoutingProvider is of type object');
  });

  // ModuleRoutingProvider should have a getInstance function
  it('should have a getInstance method which returns an instance of ModuleRoutingProvider', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    assert.instanceOf(provider, ModuleRoutingProvider, 'ModuleRoutingProvider is an instance of ModuleRoutingProvider');
  });

  // ModuleRoutingProvider should have a get method that adds the route to a router namespace
  it('should throw an error if the get method is not called with an instance of Route', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    expect( () => provider.get() ).to.throw(Error, 'Missing Route argument.');
    //assert.equal(provider.get(), true, 'ModuleRoutingProvider returns true from get method');
  });

  // ModuleRoutingProvider should take arguments in a get argument of Route
  it('should take a route as an argument', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    const route = RouteFacade.get('/admin', () => { console.log('dummy function'); } );
    assert.equal(provider.get(route), true, 'ModuleRoutingProvider accepts route as argument');
  });

  // Creating a ModuleRoutingProvider should create an instance of express Router
  it('should return a defined router', function () {
    const provider = new ModuleRoutingProvider();
    assert.notEqual(provider.router, undefined, 'Router is well defined.');
  });

  // ModuleRoutingProviderFacade should have an ability to dispose of the instance
  it('should contain a method to dispose of the ModuleRoutingProvider instance', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    assert.equal(ModuleRoutingProviderFacade.dispose(), true, 'Instance successfully nulled.');
    assert.notEqual(provider, ModuleRoutingProviderFacade.getInstance(), 'Previously created provider has been disposed.');
  });

  // ModuleRoutingProviderFacade get method should add a get route to the router
  it('should add a get route to the router', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    const expectedUrl = '/admin';
    const route = RouteFacade.get(expectedUrl, () => { console.log('dummy function'); } );

    let before_undefinedCtr = 0;
    let before_definedCtr = 0;

    let after_undefinedCtr = 0;
    let after_definedCtr = 0;

    for(index in provider.router.stack){
      if(provider.router.stack[index].route === undefined){
        before_undefinedCtr += 1;
      }else{
        before_definedCtr += 1;
      }
    }

    provider.get(route);

    for(index in provider.router.stack){
      if(provider.router.stack[index].route === undefined){
        after_undefinedCtr += 1;
      }else{
        after_definedCtr += 1;
      }
    }

    // undefinedCtr should be the same;
    assert.equal(before_undefinedCtr, after_undefinedCtr, 'Undefined ctrs are the same.');

    // definedCtr should be different;
    assert.notEqual(before_definedCtr, after_definedCtr, 'Defined ctrs are different.');

    // path should be the same as the one defined
    assert.equal(provider.router.stack[1].route.path, expectedUrl, 'Url is the same as expected.');

    // method should be get - this is not really a good test
    assert.equal(provider.router.stack[1].route.stack[0].method, 'get', 'Get method is true.');
  });

});

