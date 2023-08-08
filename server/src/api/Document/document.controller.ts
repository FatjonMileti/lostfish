import { Request, Response, Router } from 'express';
import DocumentModel from './document.schema';
import createError from 'http-errors';
import httpStatus from 'http-status';
import userService from '../User/user.service';
import { Role } from '../User/user.interface';
import authorize from '../../middleware/authorize';
import { handleUploadedDocuments } from './document.helper';

const router: Router = Router();

export class DocumentController {
  public router = router;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', authorize(), this.getAllDocuments);
    this.router.get('/by-user', authorize(), this.getDocumentByUserIds);
    this.router.get('/:id', authorize(), this.getDocumentById);
    this.router.post('/', authorize(), this.createDocument);
    this.router.patch('/:id', authorize(), this.updateDocument);
    this.router.delete('/:id', authorize(), this.deleteDocument);
  }

  /**
   * @api {get} /api/documents Get all user documents
   * @apiDescription Get a list of all user documents
   * @apiGroup Document
   * @apiSampleRequest /api/documents
   */
  protected getAllDocuments = async (request: Request, response: Response) => {
    try {
      // Replace 'DocumentModel' with your actual model for user documents
      const documents = await DocumentModel.find({ user: request.user._id });
      response.status(200).json(documents);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/documents/:id Get a user document by ID
   * @apiDescription Get a specific user document by its ID
   * @apiGroup Document
   * @apiSampleRequest /api/documents/:id
   */
  protected getDocumentById = async (request: Request, response: Response) => {
    const documentId = request.params.id;

    try {
      // Replace 'DocumentModel' with your actual model for user documents
      const document = await DocumentModel.findById(documentId);
      if (!document) {
        return response.status(404).json({ message: 'Document not found' });
      }
      response.status(200).json(document);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {get} /api/documents/by-user Get a user document users ids
   * @apiDescription Get a specific user document users ids
   * @apiGroup Document
   * @apiQuery {string} participant
   * @apiSampleRequest /api/documents/by-user
   */
  protected getDocumentByUserIds = async (request: Request, response: Response) => {
    const author = response.locals.user_id;
    const participant = request.query.participant;

    if (!author || !participant) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

    const query: any = {
      $or: [
        { tenant: { $eq: author }, landlord: { $eq: participant } },
        { tenant: { $eq: participant }, landlord: { $eq: author } }
      ]
    };
    try {
      // Replace 'DocumentModel' with your actual model for user documents
      const document = await DocumentModel.findOne(query);
      if (!document) {
        return response.status(404).json({ message: 'Document not found' });
      }
      response.status(200).json(document);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {post} /api/documents Create a new user document
   * @apiDescription Create a new user document
   * @apiGroup Document
   * @apiSampleRequest /api/documents
   */
  protected createDocument = async (request: Request, response: Response) => {
    const { file, participant } = request.body;
    const user_id = response.locals.user_id;
    const me = await userService.findOne({ _id: user_id as string });

    if (!me) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }
    try {
      // Replace 'DocumentModel' with your actual model for user documents
      const newDocument = new DocumentModel({
        tenant: me.role === Role.Client ? user_id : participant,
        landlord: me.role === Role.Landlord ? user_id : participant,
        file,
        created_by: user_id
      });
      const savedDocument = await newDocument.save();
      response.status(201).json(savedDocument);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {put} /api/documents/:id Update a user document by ID
   * @apiDescription Update a specific user document by its ID
   * @apiGroup Document
   * @apiSampleRequest /api/documents/:id
   */
  protected updateDocument = async (request: Request, response: Response) => {
    const documentId = request.params.id;
    const { file } = request.body;
    const user_id = response.locals.user_id;
    const me = await userService.findOne({ _id: user_id as string });

    if (!me) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

    const doc = await DocumentModel.findOne({ _id: documentId });

    if (!doc) {
      throw createError(httpStatus.NOT_FOUND, { message: 'document_not_found' });
    }

    if (request.body.hasOwnProperty('file')) {
      doc.file = handleUploadedDocuments(doc.file, file, me.documents);
    }

    await doc.save();

    try {
      const document = await DocumentModel.findByIdAndUpdate(
        documentId,
        { file },
        { new: true } // Return the updated document
      );
      if (!document) {
        return response.status(404).json({ message: 'Document not found' });
      }
      response.status(200).json(document);
    } catch (error: any) {
      response.status(400).send(error);
    }
  };

  /**
   * @api {delete} /api/documents/:id Delete a user document by ID
   * @apiDescription Delete a specific user document by its ID
   * @apiGroup Document
   * @apiSampleRequest /api/documents/:id
   */
  protected deleteDocument = async (request: Request, response: Response) => {
    const documentId = request.params.id;

    try {
      // Replace 'DocumentModel' with your actual model for user documents
      const deletedDocument = await DocumentModel.findByIdAndDelete(documentId);
      if (!deletedDocument) {
        return response.status(404).json({ message: 'Document not found' });
      }
      response.status(200).json({ message: 'Document deleted successfully' });
    } catch (error: any) {
      response.status(400).send(error);
    }
  };
}
