import * as process from 'process';
import { verifyToken } from '../middleware/authorize';

const sio = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const users: any = {};
const io = sio();
const socketApi: any = {};

const pubClient = createClient({ host: 'redis', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
socketApi.io = io;
socketApi.users = users;

io.on('connection', async (socket: any) => {
  const token = socket.handshake.auth.token; // jwt token passed from client

  try {
    if (!token) {
      throw new Error('Token not found');
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      throw new Error('Invalid token');
    }

    if (!users[decoded.user_id]) {
      users[decoded.user_id] = [];
    }

    users[decoded.user_id].push(socket.id);


  } catch (err) {

    socket.emit('authFailed');
    socket.disconnect();
  }

  socket.on('logout', () => {
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    // console.log(users);
    Object.keys(users).forEach((userid) => {
      if (users[userid].includes(socket.id)) {

        users[userid].pop(socket.id);
        if (users[userid].length === 0) {
          delete users[userid];
        }
      }
    });
  });
});

module.exports = socketApi;
