import express, { Router } from 'express';
import chatService from './chat.service';
import roomService from './room.service';
import { ChatDocument } from '../../data/interfaces/chat.interface';
import { Role } from '../../enums';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import mongoose, { Types } from 'mongoose';
import MessageModel from '../../data/message';
import Notification from '../../data/notification';
const router: Router = Router();

export class ChatController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authorize([Role.Admin]), paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/:id', authorize([Role.Admin]), paging({ sort: { created_at: -1 } }), this.getById);
    this.router.post('/', authorize([Role.Admin]), this.create);
    this.router.put('/read', authorize([Role.Admin]), this.readMessages);
    this.router.delete('/:id', authorize([Role.Admin]), this.delete);
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
   * @api {post} /api/chat Post
   * @apiDescription Register
   * @apiGroup Chat
   * @apiSampleRequest /api/chat
   *
   * @apiBody {string} author
   * @apiBody {string} participant
   * @apiBody {string} message
   * @apiBody {string} room_id
   *
   * @apiPermission admin
   * @apiUse bearer
   */
  private create = async (req: express.Request, res: express.Response) => {
    const chat: ChatDocument = req.body as ChatDocument;

    /*if (!chat.room_id) {
      const newRoom = await roomService.create({
        author: chat.author,
        participant: chat.participant
      });

      if (newRoom) {
        chat.room_id = newRoom._id;
      }

      await chatService.create(chat);
      return res.status(200).send(chat);
    }

    await chatService.create(chat);
    return res.status(200).send(chat);
    */
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
