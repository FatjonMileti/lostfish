import express, { Router } from 'express';
import chatService from './chat.service';
import { ChatDocument } from '../../data/interfaces/chat.interface';
import { Role } from '../../enums';
import authorize from '../../middleware/authorize';
import paging from '../../middleware/paging';
import RoomModel from '../../data/room';
import ChatModel from '../../data/message';
import mongoose, { Document, ObjectId, Schema, Mongoose } from 'mongoose';
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

    const testQuery: any = {
      $or: [{ author: { $eq: res.locals.user_id } }, { participant: { $eq: res.locals.user_id } }]
    };

    const messages = await chatService.getAll(testQuery, res.locals.paging_options);

    for (const msg of messages.docs) {
      msg.last_message = await ChatModel.findOne({ room_id: msg._id })
        .populate('sender', ['first_name', 'last_name'])
        .sort({ created_at: -1 });
    }

    res.json(messages);
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
    const messages = await chatService.getConversations(
      id,
      {
        room_id: { $eq: new mongoose.Types.ObjectId(id) }
      },
      res.locals.paging_options
    );
    res.json(messages);
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

    if (!chat.room_id) {
      const newRoom = await RoomModel.create({
        author: chat.author,
        participant: chat.participant,
        created_at: new Date()
      });

      if (newRoom) {
        chat.room_id = newRoom._id;
      }

      await chatService.create(chat);
      return res.status(200).send(chat);
    }

    await chatService.create(chat);
    return res.status(200).send(chat);
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
      await chatService.deleteChat(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'User not found' });
    }
  };
}
