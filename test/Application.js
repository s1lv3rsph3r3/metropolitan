const { assert, expect } = require('chai');
const express = require('express');
const path = require('path');
const fs = require('fs');
// const all_routes = require('express-list-endpoints');

// Application Test
describe('Application test for booting modules', () => {
let Application;

  before(function () {
    const configPath = './testing_components/config_example_2';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config`);
    Application = require('../utils/Application');
  });

  after(function () {
    const configPath = './testing_components/config';
    const absPath = path.resolve(configPath);
    const tempPath = path.resolve(absPath, '..');
    fs.renameSync(absPath, `${tempPath}/config_example_2`);
  });


  // Application should be an instance of Object
  it('should be an instance of Object', () => {
    assert.instanceOf(Application, Object, 'Application is an instance of Object.');
  });

  // Application should be a type of object
  it('should be a type of object', () => {
    assert.equal(typeof (Application), 'object', 'Application is of type object.');
  });

  // Application bootModules should return a boolean
  it('should return a boolean value', () => {
    const app = express();
    // assert of type boolean
    assert.isBoolean(Application.bootModules(app), 'are modules booted');
  });

  // Application bootModules should return an error if no app argument is given
  it('should throw an error if not app argument is given', () => {
    // expect an error when calling bootModules with no arguments
    expect(() => Application.bootModules(undefined)).to.throw(Error, 'Missing app argument.');
    expect(() => Application.bootModules(null)).to.throw(Error, 'Missing app argument');
  });

  // Application bootModules should load a list of modules from configuration files.
  it('should set up namespacing for the app with a hard coded module', function () {
    // expect the app given to exist
    const app = express();
    //console.log(all_routes(app));
    assert.isBoolean(Application.bootModules(app), 'are modules booted.');
  });
});
