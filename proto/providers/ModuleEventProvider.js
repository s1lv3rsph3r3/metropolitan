function ModuleEventProvider() {
  this.eventList = [];
};

ModuleEventProvider.prototype.addEvent = function(eventObj) {
  // This should add this to the list of events
  this.eventList.push(eventObj);
  return this;
};

ModuleEventProvider.prototype.getEventList = function(){
  // This should return the list of events;
  return this.eventList;
}

module.exports = { ModuleEventProvider };
