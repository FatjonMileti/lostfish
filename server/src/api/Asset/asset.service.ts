import axios from '../../request';
import AssetModel from './schemas/asset.schema';
import { AssetDocument, IOffer } from './asset.interface';
import createError from 'http-errors';

const getAll = async (query: any, pagingOptions: any) => {
  /*
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
*/

  return await AssetModel.paginate(
    { ...query, ...pagingOptions },
    {
      sort: { created_at: -1 }
    }
  );
};

const syncAll = async (query: any, pagingOptions: any) => {
  const response = await axios.get('/asset/get');

  return response.data.items;
};

const createAsset = async (data: AssetDocument): Promise<AssetDocument> => {
  try {
    // const response = await axios.post('/asset/post', data);
    //
    // data.asset_id = response.data.id;

    const asset: AssetDocument = new AssetModel({ ...data });
    await asset.save();
    return asset.toObject();
  } catch (error: any) {
    return error;
  }
};

const updateAsset = async (data: AssetDocument): Promise<AssetDocument> => {
  try {
    const { asset_id, ...rest } = data;
    const response = await axios.post('/asset/patch/' + data.asset_id, {
      name: data.name,
      asset_address: data.asset_address,
      status_string: data.status_string,
      transaction_type_string: data.transaction_type_string,
      master_asset_type_string: data.master_asset_type_string,
      asset_type_string: data.asset_type_string
    });

    return data;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const makeOffer = async (body: IOffer): Promise<any> => {
  return AssetModel.findOneAndUpdate(
    { _id: '646234b8723f31cea630853e' },
    { $push: { offers: body } },
    { new: true }
  );
};

const getById = async (id: string): Promise<any> => {
  const asset: AssetDocument | null = await AssetModel.findOne({ _id: id });

  if (!asset) {
    throw createError(400, 'The item does not exist');
  }

  return asset;

  /*const data: any = {
    id: 2541,
    asset_address: asset.asset_address,
    status_string: 'Completed',
    transaction_type_string: 'Sale',
    master_asset_type_string: asset.master_asset_type_string,
    asset_type_string: asset.asset_type_string
  };

  try {
    const response = await axios.patch('/asset/patch/2541', data);
    console.log(response.data, 'jjdjdjdj');
    return response.data;
  } catch (error: any) {
    console.log(error);
    return error.request;
  }
  */
};

const deleteAsset = async (id: string) => {
  return AssetModel.findByIdAndDelete(id);
};

export default { getAll, getById, createAsset, deleteAsset, makeOffer, syncAll, updateAsset };
