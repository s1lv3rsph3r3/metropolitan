const express = require('express');
const Redis = require('ioredis');
const socketio = require('socket.io');

/* PRODUCTION ONLY */
// const https = require('https');
/** **************** */

/* DEVELOPMENT ONLY */
const http = require('http');
/** ***************** */

const app = express();

/* PRODUCTION ONLY */
// set the ssl cert and key values
// const server = https.createServer({
//   key: fs.readFileSync(
//     /* Use a key generated from .env variables */
//     /* Replace with generated key */
//   ),
//   cert: fs.readFileSync(
//     /* Use a key generated from .env variables */
//     /* Replace with generated full certificate chain */
//   ),
// }, app);
/** **************** */

/* DEVELOPMENT ONLY */
const server = http.createServer(app);
/** ***************** */

const io = socketio(server);
const redis = new Redis();

module.exports = (function start(){
  const getRedis = () => {
    return redis;
  };
  const getIo = () => {
    return io;
  };
  const getServer = () => {
    return server;
  };
  const getApp = () => {
    return app;
  };
  return {
    getRedis,
    getIo,
    getServer,
    getApp,
  }
}());
