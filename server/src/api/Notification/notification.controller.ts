import express, { Router } from 'express';
import paging from '../../middleware/paging';
import Notification from './notification.schema';
import { NotificationType } from './notification.interface';
import { Types } from 'mongoose';
const router: Router = Router();

export class NotificationController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', paging({ sort: { created_at: -1 } }), this.getAll);
    this.router.get('/unread', this.getUnread);
    this.router.get('/:id', this.readMessage);
  }

  /**
   * @api {get} /api/notification/?sort=:column&order=:order&page_size=:size&page=:page Notifications retrieval (all)
   * @apiDescription Gets all notifications for the frontend of a user.
   * @apiGroup Notification
   * @apiSampleRequest /api/notification/
   *
   * @apiPermission admin
   * @apiUse bearer
   * @apiUse paging
   */

  private getAll = async (req: express.Request, res: express.Response) => {
    const userId = res.locals.user_id;

    const query: any = {
      type: NotificationType.CHAT,
      viewed: false
    };

    query.$or = [{ user: userId }];

    const notifications = await Notification.paginate(query, {
      select: {
        data: 1,
        message: 1,
        type: 1,
        viewed: 1,
        created_at: 1
      }
    });

    return res.status(200).json(notifications);
  };

  /**
   * @api {get} /api/notification/unread Unread notifications
   * @apiDescription Gets all unread notifications for the frontend of a user.
   * @apiGroup Notification
   * @apiSampleRequest /api/notification/unread
   *
   * @apiPermission admin
   * @apiUse bearer
   * @apiUse paging
   */

  private getUnread = async (req: express.Request, res: express.Response) => {
    const userId = res.locals.user_id;

    // const unread = await Notification.countDocuments({ user: userId, viewed: false });
    const unread = await Notification.aggregate([
      {
        $match: {
          viewed: false,
          user: new Types.ObjectId(userId),
          'data.room_id': { $exists: true }
        }
      },
      {
        $group: {
          _id: { room_id: '$data.room_id' }
        }
      },
      {
        $group: {
          _id: '$_id.room_id',
          count: { $sum: 1 }
        }
      }
    ]);

    const unreadMessages: number = unread.length === 1 ? unread[0]?.count : 0;

    return res.status(200).json({ unread: unreadMessages });
  };

  /**
   * @api {patch} /api/notification/:id Notification update
   * @apiDescription Updates a notification.
   * @apiGroup Notification
   * @apiSampleRequest /api/notification/:id
   * @apiParam {boolean} viewed
   * @apiPermission authorize
   * @apiUse bearer
   */
  private readMessage = async (req: express.Request, res: express.Response) => {
    const userId = res.locals.user_id;
    const { viewed } = req.body as any;
    const { id } = req.params;
    const query = {
      _id: id,
      user: userId
    };

    const notification = await Notification.findOne(query);

    if (!notification) {
      return res.sendStatus(404);
    }

    notification.viewed = viewed;
    await notification.save();

    return res.sendStatus(200);
  };
}
