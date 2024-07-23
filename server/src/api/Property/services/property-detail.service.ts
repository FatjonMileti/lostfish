import { ObjectId } from 'mongoose';
import PropertyDetailsSchema, { PropertyDetailDocument } from '../schemas/property-details.schema';
import PropertyViewSchema, { PropertyViewDocument } from '../schemas/property-view.schema';

type StringOrObjectId = string | ObjectId;

const createTenantView = async (
  propertyId: StringOrObjectId,
  user: StringOrObjectId
): Promise<PropertyViewDocument> => {
  const propertyView = new PropertyViewSchema({
    property: propertyId,
    created_by: user
  });

  return await propertyView.save();
};

const findTenantView = async (
  property: StringOrObjectId,
  user: StringOrObjectId
): Promise<PropertyViewDocument | null> => {
  return PropertyViewSchema.findOne({ created_by: user, property });
};

const createPropertyDetail = async (
  propertyId: StringOrObjectId,
  propertyScore?: string
): Promise<PropertyDetailDocument> => {
  const propertyDetails = new PropertyDetailsSchema({
    property: propertyId,
    views: 0,
    matches: 0,
    property_score: propertyScore ?? 0
  });

  return await propertyDetails.save();
};

const findAndIncrementById = async (id: string, data: any) => {
  return PropertyDetailsSchema.updateOne({ property: id }, { $inc: { ...data } }).exec();
};

const findAndUpdateByPropertyId = async (id: string, data: any) => {
  return PropertyDetailsSchema.updateOne({ property: id }, { $set: { ...data } }).exec();
};

const findPropertyByPropertyId = async (id: string) => {
  return PropertyDetailsSchema.findOne({ property: id }).lean();
};

export default {
  createTenantView,
  findTenantView,
  createPropertyDetail,
  findAndIncrementById,
  findAndUpdateByPropertyId,
  findPropertyByPropertyId
};
