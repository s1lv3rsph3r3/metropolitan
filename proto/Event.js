function Event() {}

Event.prototype.subscribe = function start(subChannel) {
  this.channel = subChannel;
  return this;
};

Event.prototype.publish = function start(publishFn) {
  this.publishHandler = publishFn;
  return this;
};

/* Export the Route prototype */
module.exports = { Event };
