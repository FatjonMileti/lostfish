import { Router } from 'express';

const router: Router = Router();
import { UserController } from './User/user.controller';
import { AccountController } from './Account/account.controller';
import { AssetController } from './Asset/asset.controller';
import { ChatController } from './Chat/chat.controller';
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

const offerController = new AssetController();
const userController = new UserController();
const accountController = new AccountController();
const chatController = new ChatController();

router.use('/account', accountController.router);
router.use('/user', userController.router);
router.use('/asset', offerController.router);
router.use('/chat/', chatController.router);


module.exports = router;
