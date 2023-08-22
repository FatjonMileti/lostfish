import express, { Router } from 'express';
import roomService from './room.service';
import paging from '../../middleware/paging';
import mongoose, { Types } from 'mongoose';
import MessageModel from './schemas/message.schema';
import Notification from '../Notification/notification.schema';
import RoomSchema from './schemas/room.schema';
import createError from 'http-errors';
import httpStatus from 'http-status';
import documentService from '../Document/document.service';
import docusignLocalService from '../Docusign/services/docusign.local.service';
import { Role } from '../User/user.interface';
import { IEnvelope } from '../Docusign/schemas/envelope';
import assetService from '../Asset/services/asset.service';
import validateId from '../../middleware/object-id.validator';
const router: Router = Router();

const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export class ChatController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/started-conversations', this.getAllConversationsByProperties);
    this.router.post('/create', this.create);
    this.router.put('/read', this.readMessages);
    this.router.get('/room', this.checkIfRoomExist);
    this.router.get('/:id', paging({ sort: { created_at: -1 } }), validateId, this.getById);
    this.router.delete('/:id', validateId, this.delete);
  }

  /**
   * @api {get} /api/chat Get all chats
   * @apiDescription Get all chats (also filter by property)
   * @apiGroup Chat
   * @apiSampleRequest /api/chat
   *
   * @apiPermission admin
   * @apiUse bearer
   * @apiUse paging
   *
   * @apiQuery {string} [property] search by property
   */

  private getAll = async (req: express.Request, res: express.Response) => {
    const { property } = req.query;
    const userId = new Types.ObjectId(res.locals.user_id);

    const query: any = {
      $or: [{ author: { $eq: userId } }, { participant: { $eq: userId } }]
    };

    if (property && !isValidObjectId(property as string)) {
      throw createError(httpStatus.BAD_REQUEST, { message: 'Invalid property id' });
    }

    if (property) {
      query.property = new Types.ObjectId(property as string);
    }

    const response = await roomService.getAll(query, res.locals.paging_options, userId);

    res.send(response);
  };

  /**
   * @api {get} /api/chat/started-conversations Get all started conversations (by properties)
   * @apiDescription Get all started conversations ( by properties)
   * @apiGroup Chat
   * @apiSampleRequest /api/chat/started-conversations
   *
   * @apiPermission admin
   * @apiUse bearer
   */

  private getAllConversationsByProperties = async (req: express.Request, res: express.Response) => {
    const userId = new Types.ObjectId(res.locals.user_id);

    const properties = await roomService.findAllProperties({
      $or: [
        { author: { $eq: new Types.ObjectId(userId) } },
        { participant: { $eq: new Types.ObjectId(userId) } }
      ]
    });

    res.send(properties);
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

    const room: any | null = await roomService.findOne({ _id: id });
    if (room) {
      const property = await assetService.findById(room.property as string);
      response.property = {
        id: property._id,
        asset_address: property.asset_address,
        area_of_interest: property.area_of_interest
      };

      const areDocumentsApproved = await documentService.canCompleteTransaction(
        room.author,
        room.participant
      );

      const landlord = room.author.role === Role.Landlord ? room.author._id : room.participant._id;
      const tenant = room.author.role === Role.Client ? room.author._id : room.participant._id;

      const isContractGenerated: IEnvelope | null = await docusignLocalService.findEnvelope({
        tenant,
        land_lord: landlord,
        property: room.property as string,
        document_type: { $eq: 'Rent Contract' }
      });

      if (res.locals.role === Role.Landlord) {
        response.areDocumentsApproved = areDocumentsApproved ? areDocumentsApproved.approved : false;
        response.isContractCreated = !!isContractGenerated;
      }
    }

    res.send(response);
  };

  /**
   * @api {get} /api/chat/room Check if room exist
   * @apiDescription Check if a room exist
   * @apiGroup Chat
   * @apiSampleRequest /api/chat/check-room
   *
   * @apiQuery {string} participant
   * @apiQuery {string} property
   * @apiPermission authorize
   * @apiUse bearer
   */
  private checkIfRoomExist = async (req: express.Request, res: express.Response) => {
    const { participant, property } = req.query;

    const query: any = {
      $or: [
        { participant: { $eq: participant }, author: { $eq: res.locals.user_id } },
        { author: { $eq: participant }, participant: { $eq: res.locals.user_id } }
      ],
      property: { $eq: property }
    };

    const response = await roomService.findOne(query);
    if (!response) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

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
      participant: room.participant,
      property: room.property
    });

    const message = { ...newRoom, room_id: newRoom._id };
    await MessageModel.create(message);
    const getRoom = await roomService.findOne({ _id: newRoom._id });
    res.status(200).send(getRoom);
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
