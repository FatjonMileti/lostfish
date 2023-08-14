import Envelope, { IEnvelope } from '../schemas/envelope';
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Role } from '../../User/user.interface';
import docusignService from './docusign.service';
import fs from 'fs';
import userService from '../../User/user.service';
import config from '../../../config';
import envelopeService from './envelope.service';

type SignUrl = string | undefined;

const createEnvelopeDoc = async (
  results: any,
  landlord: string | ObjectId | undefined,
  tenant: string | ObjectId,
  propertyId: string | ObjectId
): Promise<IEnvelope> => {
  return await Envelope.create({
    envelope_id: results.envelopeId,
    status: results.status,
    document_type: 'Rent Contract',
    status_date_time: results.statusDateTime,
    uri: results.uri,
    land_lord: landlord,
    tenant,
    property: propertyId,
    created_by: landlord
  });
};

const createPrivacyAgreementEnvelopeDoc = async (
  results: any,
  user: string | ObjectId,
  userRole: Role
): Promise<IEnvelope> => {
  const newDoc: any = {
    envelope_id: results.envelopeId,
    status: results.status,
    document_type: 'Lostfish privacy agreement',
    status_date_time: results.statusDateTime,
    uri: results.uri,
    created_by: user
  };

  if (userRole === Role.Landlord) {
    newDoc.land_lord = user;
  }
  if (userRole === Role.Client) {
    newDoc.tenant = user;
  }
  return await Envelope.create(newDoc);
};

const createTransactionAgreementEnvelopeDoc = async (
  results: any,
  user: string | ObjectId,
  userRole: Role
): Promise<IEnvelope> => {
  const newDoc: any = {
    envelope_id: results.envelopeId,
    status: results.status,
    document_type: 'Lostfish transaction agreement',
    status_date_time: results.statusDateTime,
    uri: results.uri,
    created_by: user
  };

  if (userRole === Role.Landlord) {
    newDoc.land_lord = user;
  }
  if (userRole === Role.Client) {
    newDoc.tenant = user;
  }
  return await Envelope.create(newDoc);
};

const setSignUrlForUsers = async (
  envelopeId: string,
  signUrlLandlord: SignUrl,
  signUrlTenant: SignUrl
): Promise<IEnvelope> => {
  const existingEnvelope: IEnvelope | null = await Envelope.findOne({ envelope_id: envelopeId });
  if (!existingEnvelope) {
    throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
  }

  existingEnvelope.sign_url_landlord = signUrlLandlord ?? '';
  existingEnvelope.sign_url_tenant = signUrlTenant ?? '';

  await existingEnvelope.save();
  return existingEnvelope;
};

const setLostfishPrivacySignUrlForUsers = async (
  envelopeId: string,
  signUrlUser: SignUrl,
  role: Role
): Promise<IEnvelope> => {
  const existingEnvelope: IEnvelope | null = await Envelope.findOne({ envelope_id: envelopeId });
  if (!existingEnvelope) {
    throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
  }

  if (role === Role.Landlord) {
    existingEnvelope.sign_url_landlord = signUrlUser ?? '';
  }
  if (role === Role.Client) {
    existingEnvelope.sign_url_tenant = signUrlUser ?? '';
  }

  await existingEnvelope.save();
  return existingEnvelope;
};

const updateEnvelopeById = async (id: string, data: any) => {
  return Envelope.updateOne({ _id: id }, { $set: { ...data } });
};

const getEnvelopeById = async (req: Request, res: Response) => {
  try {
    const envelope: any | null = await Envelope.findOne({ _id: req.params.id })
      .populate('land_lord')
      .populate('tenant')
      .populate('agent');

    if (!envelope) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

    if (res.locals.role === Role.Landlord && !envelope.signed_by_landlord) {
      const newEnvelope = await envelopeService.generateNewUrl({
        envelope,
        user: envelope.land_lord
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
    }

    if (
      res.locals.role === Role.Agent &&
      !envelope.sign_url_agent &&
      envelope.document_type === 'Lostfish transaction agreement'
    ) {
      const newEnvelope = await envelopeService.generateNewUrl({
        envelope,
        user: envelope.land_lord
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
    }

    if (res.locals.role === Role.Client && !envelope.signed_by_tenant) {
      const newEnvelope = await envelopeService.generateNewUrl({
        envelope,
        user: envelope.tenant
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
    }

    res.send(envelope);
  } catch (error: any) {
    console.log(error);
    res.status(error.status ?? httpStatus.NOT_FOUND).send({ message: error.request.message ?? 'Not found' });
  }
};

const downloadDocument = async (req: Request, res: Response) => {
  const fileName = req.query.fileName as string;
  try {
    const file = await docusignService.getSingleDocument(req.params.id, {});

    if (file) {
      // Send the file as a download
      res.download(file, fileName ? fileName : 'signed_document.pdf', (err) => {
        if (err) {
          console.error('Error sending the file:', err);
        } else {
          // Clean up the temporary file after it is sent
          fs.unlink(file, (error: any) => {
            if (error) {
              console.error('Error deleting the temporary file:', error);
            } else {
              console.log('Temporary file deleted.');
            }
          });
        }
      });
    } else {
      return res.redirect(config.front_end_url + '?file_is_not_signed');
    }
  } catch (error) {
    // Handle error response
    res.status(500).send('Error retrieving the signed document.');
  }
};

const generateNewSignUrls = async (req: Request, res: Response) => {
  const envelope: IEnvelope = await docusignService.updateUrl(req, res);
  res.send(envelope);
};

const successSignRedirect = async (req: Request, res: Response) => {
  const { userId, userType, envelopId, event } = req.query;

  try {
    if (userId) {
      const user = await userService.findOne({ _id: userId });
      if (!user) {
        throw createError(httpStatus.NOT_FOUND, { message: 'user_not_found' });
      }
    }
    if (event && event === 'signing_complete') {
      const existingEnvelope = await Envelope.findOne({ envelope_id: envelopId });

      if (!existingEnvelope) {
        throw createError(httpStatus.NOT_FOUND, { message: 'Envelope not found' });
      }

      if (userType && userType === Role.Client) {
        existingEnvelope.signed_by_tenant = true;
      }
      if (userType && userType === Role.Landlord) {
        existingEnvelope.signed_by_landlord = true;
      }

      if (existingEnvelope.signed_by_landlord && existingEnvelope.signed_by_tenant) {
        existingEnvelope.status = 'Signed';
      }

      await existingEnvelope.save();
      return res.redirect(`${config.front_end_url}?event=signing_complete`);
    }
    if (event && event === 'ttl_expired') {
      return res.redirect(`${config.front_end_url}/agreement?event=link_exipired`);
    }
    res.redirect(`${config.front_end_url}`);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send({ ...error });
  }
};

const getEnvelopeList = async (req: Request, res: Response) => {
  const { document_type, property, getDataFor, participant } = req.query;
  const query: { tenant?: any; land_lord?: string; document_type?: any; property?: any } = {};

  if (getDataFor === Role.Client) {
    query.land_lord = participant as string;
    query.tenant = res.locals.user_id;
  }

  if (getDataFor === Role.Landlord) {
    query.tenant = participant as string;
    query.land_lord = res.locals.user_id;
  }

  if (document_type) {
    query.document_type = { $in: document_type };
  }

  if (property) {
    query.property = { $eq: property };
  }

  const response = await Envelope.paginate(query, {
    ...res.locals.paging_options,
    populate: [
      { path: 'land_lord', select: ['first_name', 'last_name', '_id'] },
      { path: 'tenant', select: ['first_name', 'last_name', '_id'] },
      { path: 'agent', select: ['first_name', 'last_name', '_id'] }
    ]
  });
  return res.status(httpStatus.OK).send(response);
};

const getEnvelopeListDocs = async () => {
  const query: { $or?: any; document_type: any } = {
    document_type: { $in: ['Lostfish privacy agreement', 'Lostfish transaction agreement'] }
  };

  return Envelope.find(query).populate('land_lord').populate('tenant').populate('agent');
};

const generateConsentUrl = async (req: Request, res: Response) => {
  const redirectUri = docusignService.getConsent();
  res.redirect(redirectUri);
};

const findEnvelope = async (query: any = {}) => {
  return Envelope.findOne(query);
};

export default {
  findEnvelope,
  createEnvelopeDoc,
  setSignUrlForUsers,
  getEnvelopeById,
  downloadDocument,
  generateNewSignUrls,
  successSignRedirect,
  getEnvelopeList,
  generateConsentUrl,
  createPrivacyAgreementEnvelopeDoc,
  setLostfishPrivacySignUrlForUsers,
  createTransactionAgreementEnvelopeDoc,
  getEnvelopeListDocs
};
