import { verifyToken } from '../middleware/authorize';

const sio = require('socket.io');
import chatService from '../api/Chat/chat.service';
import { JwtPayload } from 'jsonwebtoken';

const users: any = {};
const io = sio();
const socketApi: any = {};

socketApi.io = io;
socketApi.users = users;

io.on('connection', async (socket: any) => {
  console.log(`User Connected: ${socket.id}`);
  const token = socket.handshake.auth.token;

  const decoded: JwtPayload | boolean = await verifyToken(token);
  if (!decoded) {
    return;
  }

  if (!users[decoded.user_id]) {
    users[decoded.user_id] = [];
  }

  users[decoded.user_id].push(socket.id);

  console.log({ users: socketApi.users, userid: decoded.user_id });

  socket.on('join_room', (data: any) => {
    socket.join(data);
    console.log('User joined room ' + data);
  });

  socket.on('send_message', async (data: any) => {
    await chatService.handleNewMessage(socket, data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    // tslint:disable-next-line:forin
    for (const userid in users) {
      const userIndex = users[userid].indexOf(socket.id);
      if (userIndex !== -1) {
        users[userid].splice(userIndex, 1);
        if (users[userid].length === 0) {
          delete users[userid];
        }
      }
    }
  });
});

module.exports = socketApi;
export default socketApi;
