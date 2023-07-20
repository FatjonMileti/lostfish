import Envelope, { IEnvelope } from '../schemas/envelope';
import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { Role, UserDocument } from '../../User/user.interface';
import docusignService from './docusign.service';

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
      console.log('landlord');
    }

    if (res.locals.role === Role.Client && !envelope.signed_by_tenant) {
      const newEnvelope = await docusignService.generateNewUrlForLoggedInUser({
        envelope,
        user: envelope.tenant
      });
      await updateEnvelopeById(req.params.id, newEnvelope);
      console.log('Tenant');
    }

    res.send(envelope);
  } catch (error: any) {
    res.status(error.status ?? httpStatus.NOT_FOUND).send({ message: error.request.message ?? 'Not found' });
  }
};

export default {
  createEnvelopeDoc,
  setSignUrlForUsers,
  getEnvelopeById
};
