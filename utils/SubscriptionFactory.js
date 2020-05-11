// const instance = require('./instance');
// const redis = instance.getRedis();

module.exports = (function start () {
  // This should subscrible to all events and call the handler for IO emit
  const subscribeToAll = (listOfEvents, modulePrefix) => {
    // take the redis instance and call subscribe with a standard console log function
    Object.values(listOfEvents).forEach((v) => {
       console.log(v.channel, modulePrefix);
       // redis subscribe
       // redis.subscribe(v.channel, (err, count) => {
       //   // subscribe to the channel
       // });
    });
  };
  return {
    subscribeToAll,
  }
}());
