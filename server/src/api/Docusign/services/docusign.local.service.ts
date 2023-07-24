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

type SignUrl = string | undefined;

const createEnvelopeDoc = async (
  results: any,
  landlord: string | ObjectId | undefined,
  tenant: string | ObjectId
): Promise<IEnvelope> => {
  return await Envelope.create({
    envelope_id: results.envelopeId,
    status: results.status,
    status_date_time: results.statusDateTime,
    uri: results.uri,
    land_lord: landlord,
    tenant,
    created_by: landlord
  });
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

const updateEnvelopeById = async (id: string, data: any) => {
  return Envelope.updateOne({ _id: id }, { $set: { ...data } });
};

const getEnvelopeById = async (req: Request, res: Response) => {
  try {
    const envelope: any | null = await Envelope.findOne({ _id: req.params.id })
      .populate('land_lord')
      .populate('tenant');

    if (!envelope) {
      throw createError(httpStatus.NOT_FOUND, { message: 'not_found' });
    }

    if (res.locals.role === Role.Landlord && !envelope.signed_by_landlord) {
      const newEnvelope = await docusignService.generateNewUrlForLoggedInUser({
        envelope,
        user: envelope.land_lord
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
    }

    if (res.locals.role === Role.Client && !envelope.signed_by_tenant) {
      const newEnvelope = await docusignService.generateNewUrlForLoggedInUser({
        envelope,
        user: envelope.tenant
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
    }

    res.send(envelope);
  } catch (error: any) {
    res.status(error.status ?? httpStatus.NOT_FOUND).send({ message: error.request.message ?? 'Not found' });
  }
};

const downloadDocument = async (req: Request, res: Response) => {
  try {
    const file = await docusignService.getSingleDocument(req.params.id, {});
    // Send the file as a download
    res.download(file, 'signed_document.pdf', (err) => {
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
  console.log(req.query);
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
  const query: any = {
    $or: [{ land_lord: { $eq: res.locals.user_id } }, { tenant: { $eq: res.locals.user_id } }]
  };

  const response = await Envelope.paginate(query, {
    ...res.locals.paging_options,
    populate: [
      { path: 'land_lord', select: ['first_name', 'last_name', '_id'] },
      { path: 'tenant', select: ['first_name', 'last_name', '_id'] }
    ]
  });
  return res.status(httpStatus.OK).send(response);
};

const generateConsentUrl = async (req: Request, res: Response) => {
  const redirectUri = docusignService.getConsent();
  res.redirect(redirectUri);
};

export default {
  createEnvelopeDoc,
  setSignUrlForUsers,
  getEnvelopeById,
  downloadDocument,
  generateNewSignUrls,
  successSignRedirect,
  getEnvelopeList,
  generateConsentUrl
};
