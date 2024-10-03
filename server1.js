#!/usr/bin/env node
'use strict';
const fastify = require('fastify')({ logger: true });
const fastifyExpress = require('@fastify/express');
const params = require('./src/params');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    // Register fastify-express plugin
    await fastify.register(fastifyExpress);

    // Use Express-like syntax within Fastify
    fastify.get('/', params, proxy);

    // Handle favicon.ico requests
    fastify.get('/favicon.ico', (req, res) => res.status(204).send());

    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
