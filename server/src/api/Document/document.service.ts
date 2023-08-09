import DocumentSchema from './document.schema';
import DocumentModel from './document.schema';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';
import docusignLocalService from '../Docusign/services/docusign.local.service';

const canCompleteTransaction = async (landlord: string | ObjectId, tenant: string | ObjectId) => {
  const query: any = {
    $or: [
      { tenant: { $eq: landlord }, landlord: { $eq: tenant } },
      { tenant: { $eq: tenant }, landlord: { $eq: landlord } }
    ]
  };

  const data = await findOne(query);

  const signedDocuments = await docusignLocalService.getEnvelopeListDocs();
  return data;
};

const findOne = async (query: any) => {
  const document = await DocumentSchema.findOne(query);
  if (!document) {
    throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
  }
  return document;
};

const findAll = async (query: any) => {
  return DocumentModel.find({ ...query });
};

export default {
  canCompleteTransaction,
  findOne,
  findAll
};
