import ChatModel from './schemas/message.schema';
import { ChatDocument } from './chat.interface';
import createError from 'http-errors';
import RoomModel from './schemas/room.schema';
import notificationSender from '../../utils/notification-sender';
import { NotificationType } from '../Notification/notification.interface';
import socketApi from '../../utils/socket.io';
import roomService from './room.service';
import { RoomDocument } from './room.interface';

const getAll = async (query: any, pagingOptions: any) => {
  return RoomModel.paginate(query, {
    ...pagingOptions,
    populate: [
      {
        path: 'author',
        select: ['first_name', 'last_name']
      },
      {
        path: 'participant',
        select: ['first_name', 'last_name']
      }
    ]
  });
};

const getById = async (id: string): Promise<ChatDocument | undefined> => {
  const chat: ChatDocument | null = await ChatModel.findOne({ _id: id }, null, {
    populate: [
      {
        path: 'author',
        select: ['first_name', 'last_name']
      },
      {
        path: 'first_name',
        select: ['firstName', 'last_name']
      }
    ]
  });
  if (!chat) {
    throw createError(404, 'The item does not exist');
  }

  return chat;
};

const getConversations = async (id: string, query: any, pagingOptions: any) => {
  return ChatModel.paginate(query, {
    ...pagingOptions,
    populate: [
      {
        path: 'author',
        select: ['first_name', 'last_name']
      },
      {
        path: 'participant',
        select: ['first_name', 'last_name']
      },
      {
        path: 'sender',
        select: ['first_name', 'last_name']
      }
    ],
    sort: {
      created_at: -1
    }
  });
};

const getLatestMessage = async (query: any) => {
  return ChatModel.findOne({ ...query })
    .populate('author', ['first_name', 'last_name'])
    .populate('sender', ['first_name', 'last_name'])
    .populate('participant', ['first_name', 'last_name'])
    .sort({ created_at: -1 });
};

const getMessagesBetweenUsers = async (
  landlord: string,
  tenant: string,
  loggedInUser: string,
  propertyId: string
) => {
  const query: any = {
    $or: [
      { participant: { $eq: landlord }, author: { $eq: tenant } },
      { participant: { $eq: tenant }, author: { $eq: landlord } }
    ],
    sender: { $ne: loggedInUser },
    seen: false
  };

  const room: RoomDocument | null = await RoomModel.findOne({
    $or: [
      { participant: { $eq: landlord }, author: { $eq: tenant } },
      { participant: { $eq: tenant }, author: { $eq: landlord } }
    ],
    property: { $eq: propertyId }
  });

  if (room) {
    query.room_id = room._id;
  }

  const messages = await ChatModel.find({ ...query })
    .populate('author', ['first_name', 'last_name'])
    .populate('sender', ['first_name', 'last_name'])
    .populate('participant', ['first_name', 'last_name'])
    .sort({ created_at: -1 });

  const unseenMessages = messages.map((message: any) => message.seen === false);
  return unseenMessages.length;
};

const findOne = async (query: any) => {
  return ChatModel.findOne({ ...query });
};

const create = async (chat: ChatDocument): Promise<ChatDocument> => {
  const chatDocument = new ChatModel({
    ...chat
  });

  return await chatDocument.save();
};

const deleteChat = async (id: string): Promise<any> => {
  return ChatModel.findByIdAndDelete(id);
};

const handleNewMessage = async (socket: any, data: any) => {
  let room: any | null = null;
  if (!data.room_id) {
    const createRoom = await RoomModel.create({ ...data });
    room = await roomService.getRoomDetails({ _id: createRoom._id });
    socket.emit('receive_room_id', room);
    data.room_id = createRoom._id;
  } else {
    room = await roomService.getRoomDetails({ _id: data.room_id });
  }
  data.participant = room.participant._id;
  data.author = room.author._id;

  const newMessage: ChatDocument = await create(data);
  if (newMessage && newMessage?.room_id) {
    const userToBeNotified =
      data.sender.toString() === data.participant.toString()
        ? data.author.toString()
        : data.participant.toString();

    await notificationSender.notifyUser({
      user: userToBeNotified,
      entity: 'Message',
      entity_id: newMessage._id,
      data: newMessage,
      type: NotificationType.CHAT
    });

    const messagesData = await getLatestMessage({ room_id: { $eq: newMessage.room_id } });
    socket.to(data.room_id).emit('receive_message', messagesData);

    const roomDetails = await roomService.findWithAggregate(data.room_id);
    socketApi.users[userToBeNotified]?.forEach((socketId: string) => {
      socket.to(socketId).emit('update_message_list', roomDetails);
    });
  }
};

export default {
  getAll,
  getById,
  findOne,
  create,
  deleteChat,
  getConversations,
  getLatestMessage,
  handleNewMessage,
  getMessagesBetweenUsers
};
