import express, { Router } from 'express';
import roomService from './room.service';
import paging from '../../middleware/paging';
import mongoose, { Types } from 'mongoose';
import MessageModel from './schemas/message.schema';
import Notification from '../Notification/notification.schema';
import { RoomDocument } from './room.interface';
import RoomSchema from './schemas/room.schema';
const router: Router = Router();

export class ChatController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/:id', paging({ sort: { created_at: -1 } }), this.getById);
    this.router.post('/create', this.create);
    this.router.put('/read', this.readMessages);
    this.router.delete('/:id', this.delete);
  }

  /**
   * @api {get} /api/chat Get
   * @apiDescription Get all chats
   * @apiGroup Chat
   * @apiSampleRequest /api/chat
   *
   * @apiPermission admin
   * @apiUse bearer
   * @apiUse paging
   *
   * @apiQuery {string} [search] search by ...
   *
   * @apiQuery {boolean} [isDisabled] filter
   * @apiQuery {string} [role] filter
   * @apiQuery {date} [createdAtSince] filter
   * @apiQuery {date} [createdAtUntil] filter
   */

  private getAll = async (req: express.Request, res: express.Response) => {
    const { search } = req.query;
    const userId = new Types.ObjectId(res.locals.user_id);
    const query: any = {
      $or: [{ author: { $eq: userId } }, { participant: { $eq: userId } }]
    };

    const response = await roomService.getAll(query, res.locals.paging_options, userId);
    res.send(response);
  };

  /**
   * @api {get} /api/chat/:id Get by room Id
   * @apiDescription Get messages
   * @apiGroup Chat
   * @apiSampleRequest /api/chat/:id
   *
   * @apiParam id chat id
   * @apiPermission authorize
   * @apiUse bearer
   */
  private getById = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const userId = new Types.ObjectId(res.locals.user_id);
    const query: any = {
      room_id: { $eq: new mongoose.Types.ObjectId(id) }
    };

    const response = await roomService.getMessages(query, res.locals.paging_options, userId);
    res.send(response);
  };

  private readMessages = async (req: express.Request, res: express.Response) => {
    const userId = res.locals.user_id;
    const { room_id } = req.body;

    const updateMany = await MessageModel.updateMany(
      { room_id, sender: { $ne: userId }, seen: false },
      { $set: { seen: true } }
    );

    await Notification.updateMany(
      {
        'data.room_id': { $eq: new Types.ObjectId(room_id) },
        'data.sender': { $ne: new Types.ObjectId(userId) },
        viewed: false
      },
      { $set: { viewed: true } }
    );

    res.send(updateMany);
  };

  /**
   * @api {post} /api/chat/create Post
   * @apiDescription Start new chat
   * @apiGroup Chat
   * @apiSampleRequest /api/chat/create
   *
   * @apiBody {string} author
   * @apiBody {string} participant
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private create = async (req: express.Request, res: express.Response) => {
    const room: any = req.body;

    const newRoom = await RoomSchema.create({
      author: room.author,
      participant: room.participant
    });

    const message = { ...newRoom, room_id: newRoom._id };
    await MessageModel.create(message);
    res.status(200).send(newRoom);
  };

  /**
   * @api {delete} /api/user/:id Delete
   * @apiDescription Delete user
   * @apiGroup User
   * @apiSampleRequest /api/user/:id
   * @apiParam id
   * @apiPermission admin
   * @apiUse bearer
   */

  private delete = async (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    try {
      await roomService.deleteRoom(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };
}
