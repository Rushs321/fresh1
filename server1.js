#!/usr/bin/env node
'use strict';
const fastify = require('fastify')();
const express = require('@fastify/express');
const params = require('./src/params');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 3000;

async function start() {
  // Register the express plugin
  await fastify.register(express);

  // Use Express middleware for handling parameters and proxy logic
  fastify.use('/', params, (req, res, next) => {
    if (req.path === '/') {
      return proxy(req, res);
    }
    next();
  });

  // Handle favicon.ico separately
  fastify.use('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  // Start the server
  fastify.listen({ host: '0.0.0.0', port: PORT }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
}

start();
