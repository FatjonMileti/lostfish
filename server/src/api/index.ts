import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from './User/user.controller';
import { AssetController } from './Asset/asset.controller';
import { ChatController } from './Chat/chat.controller';
import { MapController } from './Map/map.controller';
import { NotificationController } from './Notification/notification.controller';
import { AttributeController } from './Attribute/attribute.controller';
import { ConditionController } from './Condition/condition.controller';
import defineAbilitiesFor from '../casl/casl';
import { Role } from './User/user.interface';

const router: Router = Router();
/**
 * @apiDefine anonymous Anonymous access
 * Does not require a token
 */
/**
 * @apiDefine authorize Token
 * Does require a token
 */
/**
 * @apiDefine admin Token
 * Requires admin role
 */

/**
 * @apiDefine bearer
 * @apiHeader {string} Authorization accepts JWTs.
 * Ex: `Bearer IiwiYXVkI.joic3Vycm91bmQuZWNvc3lzdGVtIiwic2NvcGUi.OlsicmVmcmVza`
 */

/**
 * @apiDefine paging
 * @apiQuery {number} [page]
 * @apiQuery {number} [pageSize]
 * @apiQuery {string} [sort] sort column
 * @apiQuery {boolean} [asc=false] sort direction
 */

// router.use(async (req: Request, res: Response, next: NextFunction) => {
//   req.ability = defineAbilitiesFor(Role.Admin);
//   next();
// });

const offerController = new AssetController();
const userController = new UserController();
const chatController = new ChatController();
const mapController = new MapController();
const notificationController = new NotificationController();
const attributeController = new AttributeController();
const conditionController = new ConditionController();
router.use('/user', userController.router);
router.use('/asset', offerController.router);
router.use('/chat', chatController.router);
router.use('/map', mapController.router);
router.use('/attribute', attributeController.router);
router.use('/condition', conditionController.router);
router.use('/notification', notificationController.router);

module.exports = router;
