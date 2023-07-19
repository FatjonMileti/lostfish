import { Router } from 'express';
import { UserController } from './User/user.controller';
import { AssetController } from './Asset/asset.controller';
import { ChatController } from './Chat/chat.controller';
import { MapController } from './Map/map.controller';
import { NotificationController } from './Notification/notification.controller';
import { AttributeController } from './Attribute/attribute.controller';
import { ConditionController } from './Condition/condition.controller';
import { AccountController } from './Account/account.controller';
import authorize from '../middleware/authorize';
import UploadService from '../utils/image';
import { ProtectedApiController } from './Get/get-data.controller';
import { CriteriaController } from './Criteria/criteria.controller';
import { DocusignController } from './Docusign/docusign-test.controller';
import { S3Controller } from './S3Controller/s3.controller';
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

/**
 * @api {post} /api/upload Upload images
 * @apiDescription Upload images
 *
 * @apiHeader {String} Content-Type multipart/form-data
 *
 * @apiParam {File[]} images Array of image files to upload.
 * @apiGroup Upload
 * @apiSampleRequest /api/upload
 *
 * @apiPermission admin
 * @apiUse bearer
 */

const uploadService = UploadService.getInstance();
const publicUploader = uploadService.createPublicUploader();
const protectedUploader = uploadService.createPrivateUploader();

router.post('/upload', authorize(), publicUploader.array('images'), (req, res) => {
  res.status(200).send(req.files);
});

router.post('/upload-docs', authorize(), protectedUploader.array('images'), (req, res) => {
  res.status(200).send(req.files);
});

const protectedController = new ProtectedApiController();

const criteriaController = new CriteriaController();
const accountController = new AccountController();
const offerController = new AssetController();
const userController = new UserController();
const chatController = new ChatController();
const mapController = new MapController();
const notificationController = new NotificationController();
const attributeController = new AttributeController();
const conditionController = new ConditionController();
const docusignController = new DocusignController();
const s3controller = new S3Controller();
router.use('/v1', protectedController.router);

router.use('/s3', s3controller.router);
router.use('/docusign', docusignController.router);
router.use('/criteria', criteriaController.router);
router.use('/account', accountController.router);
router.use('/user', authorize(), userController.router);
router.use('/asset', offerController.router);
router.use('/chat', authorize(), chatController.router);
router.use('/map', mapController.router);
router.use('/attribute', authorize(), attributeController.router);
router.use('/condition', authorize(), conditionController.router);
router.use('/notification', authorize(), notificationController.router);

module.exports = router;
