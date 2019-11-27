const { Event } = require('../proto/Event');
const ModuleEventProvider = require('./providers/ModuleEventProviderFacade');

module.exports = (function start() {
  const subscribe = (channelName) => {
    console.log('this is subscribe');
    // use the provider facade instance to get instance and add a route
    const event = (new Event()).subscribe(channelName);
    (ModuleEventProvider.getInstance()).addEvent(event);
    return event;
  };

  return {
    subscribe,
  };
}());