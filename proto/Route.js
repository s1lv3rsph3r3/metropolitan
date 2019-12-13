function Route() {}

Route.prototype.get = function start(url, fn) {
  // If the url is not defined then throw an error
  if (url === undefined || url === null) {
    throw (new Error('Missing required arguments.'));
  }

  // If this.url already exists then do not allow altering
  if (this.url !== undefined && this.url !== null) {
    throw (new Error('Cannot chain HTTP verbs.'));
  }

  // If the handler is not defined then throw an error
  if (fn === undefined || fn === null) {
    throw (new Error('Missing a handler for route.'));
  }
  this.url = url;
  this.handler = fn;
  return this;
};

Route.prototype.post = function start(url) {
  // If the url is not defined then throw an error
  if (url === undefined || url === null) {
    throw (new Error('Missing required arguments.'));
  }

  // If this.url exists already then do not allow altering
  if (this.url !== undefined && this.url !== null) {
    throw (new Error('Cannot chain HTTP verbs.'));
  }

  this.url = url;
  return this;
};

Route.prototype.setName = function start(val) {
  if (val === undefined) {
    throw (new Error('Missing required arguments.'));
  }
  this.name = val;
  return this;
};


/* Get functions to access the object */
Route.prototype.getUrl = function start() {
  return this.url;
};

Route.prototype.getName = function start() {
  return this.name;
};

Route.prototype.getHandler = function start() {
  return this.handler;
};

/* Export the Route prototype */
module.exports = { Route };
