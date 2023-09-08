import { verifyToken } from '../middleware/authorize';
import { Socket } from 'socket.io';
import chatService from '../api/Chat/chat.service';
import { JwtPayload } from 'jsonwebtoken';
import propertyDetailService from '../api/Property/services/property-detail.service';

const users: any = {};

const socketApi: { users: any } = { users };

export const handleSocketActions = async (socket: Socket) => {
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

  socket.on('join_room', (room: string) => {
    socket.join(room);
    console.log('User joined room ' + room);
  });

  socket.on('send_message', async (data: any) => {
    await chatService.handleNewMessage(socket, data);
  });

  socket.on('view_property', async (data: { propertyId: string; userId: string }) => {
    const isPropertyViewed = await propertyDetailService.findTenantView(data.propertyId, data.userId);
    if (!isPropertyViewed) {
      await propertyDetailService.createTenantView(data.propertyId, data.userId);
      await propertyDetailService.findAndIncrementById(data.propertyId, { views: 1 });
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);

    for (const userid in users) {
      if (users.hasOwnProperty(userid)) {
        const userIndex = users[userid].indexOf(socket.id);
        if (userIndex !== -1) {
          users[userid].splice(userIndex, 1);
          if (users[userid].length === 0) {
            delete users[userid];
          }
        }
      }
    }
  });
};

export default socketApi;
