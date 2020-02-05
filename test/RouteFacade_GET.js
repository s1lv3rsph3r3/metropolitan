const { assert, expect } = require('chai');
const fs = require('fs');
const path = require('path');

const { Route } = require('../proto/Route');

// RouteFacade and Prototype Test for GET verb
describe('RouteFacade and Prototype Test for GET verb', function () {
let RouteFacade;
let ModuleRoutingProviderFacade;

  before(function () {
    const configPath = './testing_components/config_example_2';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config`);

    // Global RouteFacade and ModuleRoutingProviderFacade for every test
    RouteFacade = require('../facade/RouteFacade');
    ModuleRoutingProviderFacade = require('../facade/providers/ModuleRoutingProviderFacade');
  });

  after(function () {
    const configPath = './testing_components/config';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config_example_2`);
  });

  // RouteFacade should be and instance of Object
  it('should be an instance of Object', function () {
    assert.instanceOf(RouteFacade, Object, 'RouteFacade is an instance of Object');
  });

  // RouteFacade should be a type of Function
  it('should be a type of Function', function () {
    assert.equal(typeof(RouteFacade), 'object', 'RouteFacade is of type object');
  });

  // Route get should have return error is no url is supplied to the get method
  it('should return an error if no url argument is supplied', function () {
    const route = new Route();
    expect( () => route.get()).to.throw(Error, 'Missing required arguments.');
    expect( () => route.get(null)).to.throw(Error, 'Missing required arguments.');
  });

  // RouteFacade get method should return a route with a url
  it('should return a get route with a url', function () {
    const expectedUrl = '/admin';
    const fn = () => { return 'VALUE'; };
    const route = RouteFacade.get(expectedUrl, fn);
    assert.equal(route.getUrl(), expectedUrl, 'Route has the expected URL');
  });

  // RouteFacade name method should return an error
  it('should return an error as no method should exist', function () {
    expect( () => RouteFacade.name() ).to.throw(Error);
  });

  // RouteFacade should generate a url with a name
  it('should generate a get url with a given name', function () {
    const expectedUrl = '/admin';
    const expectedName = 'admin.route';
    const fn = () => { return 'VALUE'; };
    const route = RouteFacade.get(expectedUrl, fn).setName(expectedName);
    assert.equal(route.getName(), expectedName, 'Route has the expected Name');
  });

  // RouteFacade should throw an error when not given a function as a second param
  it('should throw an error if the get function is called without fn argument', function () {
    const expectedUrl = '/admin';
    // const fn1 = undefined;
    // const fn2 = null;

    // expect( () => RouteFacade.get(expectedUrl, fn1).to.throw(Error, 'Missing fn argument.') );

    // expect( () => RouteFacade.get(expectedUrl, fn2).to.throw(Error, 'Missing fn argument.') );
    // RouteFacade.get(expectedUrl);
    expect( () => RouteFacade.get(expectedUrl)).to.throw(Error, 'Missing fn argument.');

  });

  // RouteFacade should throw an error if the setName function is called without a name argument
  it('should return an error if no name argument is supplied', function () {
    const expectedUrl = '/admin';
    const fn = () => { return 'VALUE'; };
    expect( () => RouteFacade.get(expectedUrl, fn).setName() ).to.throw(Error, 'Missing required arguments.');
  });

  // RouteFacade should throw an error if the get method is missing path argument
  it('should return an error if no url argument is supplied', function () {
    expect( () => RouteFacade.get() ).to.throw(Error, 'Missing URL argument.');
  });

  // RouteFacade should throw an error if the get method is supplied with a null path argument
  it('should return an error if NULL url argument is supplied', function () {
    expect( () => RouteFacade.get(null) ).to.throw(Error, 'Missing URL argument');
  });

  // Route should throw an error if t he get method is chained to the post method
  it('should throw an error if the get method is chained to post method', function () {
    const route = new Route();
    const dummyUrl = '/admin';
    const fn = () => { return 'VALUE'; };
    expect( () => route.get(dummyUrl, fn).post(dummyUrl) ).to.throw(Error, 'Cannot chain HTTP verbs.');
  });

  // RouteFacade get method should add a GET route to the router defined in ModuleRoutingProvider
  it('should add a get method to the router as defined in ModuleRoutingProvider', function () {
    const provider = ModuleRoutingProviderFacade.getInstance();
    const expectedUrl = '/admin';
    const fn = () => { return 'VALUE'; };

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

    //provider.get(route);
    RouteFacade.get(expectedUrl, fn);

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

