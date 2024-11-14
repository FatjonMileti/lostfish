import { Router } from 'express';
import authorize from '../middleware/authorize';
/* CONTROLLERS */
import { UserController } from './User/user.controller';
import { PropertyController } from './Property/property.controller';
import { ChatController } from './Chat/chat.controller';
import { MapController } from './Map/map.controller';
import { NotificationController } from './Notification/notification.controller';
import { DocumentController } from './Document/document.controller';
import { AccountController } from './Account/account.controller';
import { ProtectedApiController } from './Get/get-data.controller';
import { CriteriaController } from './Criteria/criteria.controller';
import { DocusignController } from './Docusign/docusign-test.controller';
import { FileController } from './File/file.controller';
import { MatchController } from './Match/match.controller';
import { AdminController } from './Agent/admin.controller';
import { SuggestionController } from './Suggestions/suggestion.controller';
import { OfferController } from './Offer/offer.controller';

/* SERVICES */
import MatchService from './Match/match.service';
import MatchModel from './Match/match.schema';
import { LoginLog, AssetLog, MatchLog } from '../data/logs';
import AdminService from './Agent/admin.service';
import SuggestionService from './Suggestions/suggestion.service';
import PropertySchema from './Property/schemas/property.schema';
import CriteriaSchema from './Criteria/schemas/criteria.schema';
import config from '../config/index';
import LocalFileService from './File/services/file.service';
import AzureBlobService from './File/services/azure-blob.service';
import { FileService } from './File/file.interface';
import OfferService from './Offer/offer.service';
import OfferModel from './Offer/offer.schema';
import videoRouter from "./Video/video.router";

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

// Create services instances
const matchService = new MatchService(MatchModel);
const adminService = new AdminService(LoginLog, AssetLog, MatchLog);

export const suggestionService = new SuggestionService(PropertySchema, CriteriaSchema);

export const fileService: FileService = config.useAzureStorage
  ? AzureBlobService.getInstance()
  : LocalFileService.getInstance();

const offerService: OfferService = new OfferService(OfferModel);

// Create controller instances
const suggestionController = new SuggestionController(suggestionService);
const adminController = new AdminController(adminService);
const matchController = new MatchController(matchService);
const protectedController = new ProtectedApiController();
const criteriaController = new CriteriaController();
const accountController = new AccountController();
const assetController = new PropertyController(fileService);
const userController = new UserController();
const chatController = new ChatController(matchService);
const mapController = new MapController();
const notificationController = new NotificationController();
const documentController = new DocumentController(fileService);
const docusignController = new DocusignController();
const fileController = new FileController(fileService);
const offerController = new OfferController(offerService, matchService);

router.use('/v1', protectedController.router);
router.use('/suggestion', suggestionController.router);
router.use('/admin', adminController.router);
router.use('/document', documentController.router);
router.use('/match', matchController.router);
router.use('/file', fileController.router);
router.use('/docusign', docusignController.router);
router.use('/criteria', criteriaController.router);
router.use('/account', accountController.router);
router.use('/user', userController.router);
router.use('/asset', assetController.router);
router.use('/chat', authorize(), chatController.router);
router.use('/map', mapController.router);
router.use('/notification', authorize(), notificationController.router);
router.use('/offer', authorize(), offerController.router);
router.use('/video', videoRouter)
export default router;
