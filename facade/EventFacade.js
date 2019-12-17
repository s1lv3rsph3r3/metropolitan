const { Event } = require('../proto/Event');
const ModuleEventProvider = require('./providers/ModuleEventProviderFacade');

module.exports = (function start() {
  const subscribe = (channelName) => {
    // Create the Event and add to our global ModuleEventProvider
    const event = (new Event()).subscribe(channelName);
    (ModuleEventProvider.getInstance()).addEvent(event);
    return event;
  };

  return {
    subscribe,
  };
}());
