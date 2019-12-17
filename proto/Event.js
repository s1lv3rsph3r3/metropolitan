function Event() {
  this.channel = null;
  this.publishHandler = null;
}

Event.prototype.subscribe = function start(subChannel) {
  this.channel = subChannel;
  return this;
};

Event.prototype.publish = function start(publishFn) {
  this.publishHandler = publishFn;
  return this;
};

module.exports = { Event };
