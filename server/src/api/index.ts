import { Router, Request, Response } from 'express';

const router: Router = Router();
import { UserController } from './User/user.controller';
import { AccountController } from './Account/account.controller';
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
 * @apiHeader {string} Authorization accepts JWTs. Ex: `Bearer IiwiYXVkI.joic3Vycm91bmQuZWNvc3lzdGVtIiwic2NvcGUi.OlsicmVmcmVza`
 */

/**
 * @apiDefine paging
 * @apiQuery {number} [page]
 * @apiQuery {number} [pageSize]
 * @apiQuery {string} [sort] sort column
 * @apiQuery {boolean} [asc=false] sort direction
 */

router.use('/account', require('./account'));
router.use('/testCollection', require('./testCollection'));
router.use('/user', require('./user'));
module.exports = router;
