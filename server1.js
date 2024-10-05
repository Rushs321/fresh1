const fastify = require('fastify')({logger:false, trustProxy:true});
const express = require('@fastify/express');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 8080;

async function start() {
  // Register the express plugin
  await fastify.register(express);

  // Use Express middleware for handling the proxy
  fastify.use('/', (req, res) => {
    
      return proxy(req, res);
    
    
  });

  // Handle favicon.ico separately
  fastify.use('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  // Start the server
  fastify.listen({host: '0.0.0.0' , port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
});
}

start();
