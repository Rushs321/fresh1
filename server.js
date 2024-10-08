#!/usr/bin/env node
'use strict'
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork()
    });

  return true;
}

const app = require('express')()
const proxy = require('./src/proxy')

const PORT = process.env.PORT || 8080

app.enable('trust proxy')
app.get('/', proxy)
app.get('/favicon.ico', (req, res) => res.status(204).end())
app.listen(PORT, () => console.log(`Worker ${process.pid}: Listening on ${PORT}`))
