const sio = require('socket.io');
import chatService from '../api/Chat/chat.service';

const users: any = {};
const io = sio();
const socketApi: any = {};

socketApi.io = io;
socketApi.users = users;

io.on('connection', (socket: any) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data: any) => {
    socket.join(data);
    console.log('User joined room ' + data.room_id);
  });

  socket.on('send_message', async (data: any) => {
    console.log({ data });
    await chatService.handleNewMessage(socket, data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

module.exports = socketApi;
