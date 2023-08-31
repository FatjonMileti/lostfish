#!/usr/bin/env node
/**
 * Module dependencies.
 */
const app = require('../app');
const debug = require('debug')('backend.api:server');
import { Server as ExpressServer, createServer } from 'http';
import config from '../config/index';
import { AddressInfo } from 'net';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

const port: string | number | boolean = normalizePort(config.port || '3000');

app.set('port', port);

/**
 * Create HTTP server.
 */

export const server: ExpressServer = createServer(app);
import socketApi from '../utils/socket.io';
const io = socketApi.io;

const redisURI = 'redis://localhost:6379'; // Change this to your Redis URI
const redis = new Redis(redisURI);

const subClient = redis.duplicate();
io.adapter(createAdapter(redis, subClient));

io.attach(server, {
  cors: {
    origin: config.frontendUrl
  }
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | string | boolean {
  const p = parseInt(val, 10);

  if (isNaN(p)) {
    // named pipe
    return val;
  }

  if (p >= 0) {
    // port number
    return p;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr: string | AddressInfo | null = server.address();
  if (addr === null) return debug('failed to bind');

  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

process.on('beforeExit', () => {
  if (redis) {
    redis.quit().catch((err: any) => {
      console.error('Error closing Redis connection:', err);
    });
  }
});
