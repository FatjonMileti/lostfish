import Envelope, { IEnvelope } from '../schemas/envelope';
import { ObjectId } from 'mongoose';
import createError from 'http-errors';
import httpStatus from 'http-status';

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

export default {
  createEnvelopeDoc,
  setSignUrlForUsers
};
