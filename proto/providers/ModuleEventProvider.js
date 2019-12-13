function ModuleEventProvider() {
  this.eventList = [];
}

ModuleEventProvider.prototype.addEvent = function addEvent(eventObj) {
  // This should add this to the list of events
  this.eventList.push(eventObj);
  return this;
};

ModuleEventProvider.prototype.getEventList = function getEventList() {
  // This should return the list of events;
  return this.eventList;
};

module.exports = { ModuleEventProvider };
