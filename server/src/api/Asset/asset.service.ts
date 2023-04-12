import axios from '../../utils';
import AssetModel from '../../data/asset';
import { AssetDocument } from '../../data/interfaces/asset.interface';
import createError from 'http-errors';


const getAll = async () => {
  const response = await axios.get('/asset/get');

  const dataToUpdate = response.data.items.map((data: any) => {
    return {
      updateOne: {
        filter: { name: data.name },
        update: {
          ...data
        },
        upsert: true
      }
    };
  });
  await AssetModel.bulkWrite(dataToUpdate, { ordered: false });
  
  return response.data;
};

const createAsset = async () => {
  const data = {
    name: 'Test Asset from api 5',
    description: 'string',
    asset_address: {
      latitude: -90,
      longitude: -180,
      street_number: 'string',
      route: 'string',
      neighbourhood: 'string',
      postal_town: 'string',
      postal_code: '1025',
      administrative_area_level_1: 'string',
      country_code: 'IRL',
      text: 'string'
    },
    status_string: 'Draft',
    transaction_type_string: 'Sale',
    master_asset_type_string: 'Unknown',
    asset_type_string: 'Unknown',
    currency_code: 'EUR',
    reserved: true,
    asset_sale: {
      asking_price: 0,
      minimum_offer: 0,
      offer_increment_amount: 1000,
      date_go_live: new Date(),
      date_offer_deadline: new Date(),
      date_exchanged: new Date(),
      date_completion: new Date(),
      offers_extension: 1,
      contract_deposit_percent: 0,
      booking_deposit_amount: 0,
      special_conditions: 'string',
      show_all_offers: true,
      show_highest_offer: true,
      enable_downward_bidding: true,
      downward_bidding_allowed_percentage: 5,
      asset_fee: {}
    }
  };

  try {
    const request = await axios.post('/asset/post', data);
    if (request.status === 201) {
      // @ts-ignore
      return await new AssetModel.create({ ...data });
    }

  } catch (error: any) {
    return error;
  }
};


const getById = async (id: string): Promise<AssetDocument> => {
  const asset: AssetDocument | null = await AssetModel.findOne({ _id: id });
  if (!asset) {
    throw createError(400, 'The item does not exist');
  }
  return asset;
};

const deleteAsset = async (id: string) => {
  return AssetModel.findByIdAndDelete(id);
};

export default { getAll, getById, createAsset, deleteAsset };
