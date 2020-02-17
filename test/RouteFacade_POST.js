const { assert, expect } = require('chai');
const path = require('path');
const fs = require('fs');
//const RouteFacade = require('../facade/RouteFacade');
//const Route = require('../proto/Route');

// RouteFacade and Prototype Test for GET verb
describe('RouteFacade and Prototype Test for POST verb', function () {

let RouteFacade;
let Route;

  before(function(){
    const configPath = './testing_components/config_example_2';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config`);

    // config is correctly setup
    RouteFacade = require('../facade/RouteFacade');
    Route = require('../proto/Route');
  });

  after(function(){
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

  // Route post should have return error is no url is supplied to the get method
  it('should return an error if no url argument is supplied', function () {
    const route = new Route();
    expect( () => route.post()).to.throw(Error, 'Missing required arguments.');
    expect( () => route.post(null)).to.throw(Error, 'Missing required arguments.');
  });

  // RouteFacade post method should return a route with a url
  it('should return a post route with a url', function () {
    const expectedUrl = '/admin';
    const route = RouteFacade.post(expectedUrl);
    assert.equal(route.getUrl(), expectedUrl, 'Route has the expected URL');
  });

  // RouteFacade name method should return an error - Generic to RouteFacade
  it('should return an error as no method should exist', function () {
    expect( () => RouteFacade.name() ).to.throw(Error);
  });

  // RouteFacade should generate a url with a name
  it('should generate a post url with a given name', function () {
    const expectedUrl = '/admin';
    const expectedName = 'admin.route';
    const route = RouteFacade.post(expectedUrl).setName(expectedName);
    assert.equal(route.getName(), expectedName, 'Route has the expected Name');
  });

  // RouteFacade should throw an error if the setName function is called without a name argument
  it('should return an error if no name argument is supplied', function () {
    const expectedUrl = '/admin';
    expect( () => RouteFacade.post(expectedUrl).setName() ).to.throw(Error, 'Missing required arguments.');
  });

  // RouteFacade should throw an error if the post method is missing path argument
  it('should return an error if no url argument is supplied', function () {
    expect( () => RouteFacade.post() ).to.throw(Error, 'Missing URL argument.');
  });

  // RouteFacade should throw an error if the post method is supplied with a null path argument
  it('should return an error if NULL url argument is supplied', function () {
    expect( () => RouteFacade.post(null) ).to.throw(Error, 'Missing URL argument');
  });

  // Route should throw an error if the post method is chained to the get method
  it('should throw an error if the post method is chained to get method', function () {
    const route = new Route();
    const dummyUrl = '/admin';
    expect( () => route.post(dummyUrl).get(dummyUrl) ).to.throw(Error, 'Cannot chain HTTP verbs.');
  });

  //--------------------- Not sure these are really necessary -----------------------//

  // RouteFacade should only exist once
  it.skip('should only have 1 isntance of RouteFacade', function (){
    const RouteFacadeOne = require('../RouteFacade');
    const RouteFacadeTwo = require('../RouteFacade');
    assert.equal(RouteFacadeOne, RouteFacadeTwo, 'Only 1 exists');
  });

  it.skip('should only have 1 instance of RouteFacade', function () {
    const RouteFacadeOne = require('../RouteFacade');
    const RouteFacadeTwo = require('../RouteFacade');
    assert.equal(RouteFacadeOne.getValue(), 'Hello', 'RouteFacadeOne has Hello');
    assert.equal(RouteFacadeTwo.getValue(), 'Hello', 'RouteFacadeTwo has Hello');
    RouteFacadeOne.alterValue();
    assert.equal(RouteFacadeTwo.getValue(), 'Goodbye', 'RouteFacadeTwo has Goodbye');
  });

});

