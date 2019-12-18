const fs = require('fs');
const express = require('express');
const Redis = require('ioredis');
const socketio = require('socket.io');
const { BRC487 } = require('@s1lv3rsph3r3/central');
const { sslKey, sslCert } = require(BRC487.commute('environment'));

/* PRODUCTION ONLY */
const https = require('https');
/** **************** */

/* DEVELOPMENT ONLY */
//const http = require('http');
/** ***************** */

const app = express();

/* PRODUCTION ONLY */
// set the ssl cert and key values
const server = https.createServer({
  key: fs.readFileSync(
    /* Use a key generated from .env variables */
    /* Replace with generated key */
    sslKey
  ),
  cert: fs.readFileSync(
    /* Use a key generated from .env variables */
    /* Replace with generated full certificate chain */
    sslCert
  ),
}, app);
/** **************** */

/* DEVELOPMENT ONLY */
//const server = http.createServer(app);
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
