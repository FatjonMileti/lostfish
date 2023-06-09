import offrIoRequest from '../offr-io.request';
import { AssetDocument } from '../api/Asset/asset.interface';

const getAssets = async (): Promise<any[]> => {
  const response = await offrIoRequest.get('/asset/get');
  return response.data.items;
};

const updateAssetByAssetId = async (assetId: number, body: AssetDocument) => {
  return await offrIoRequest.patch('/asset/patch/' + assetId, {
    name: body.name,
    asset_address: body.asset_address,
    status_string: body.status_string,
    transaction_type_string: body.transaction_type_string,
    master_asset_type_string: body.master_asset_type_string,
    asset_type_string: body.asset_type_string
  });
};

const createAsset = async (asset: AssetDocument) => {
  const response = await offrIoRequest.post('/asset/post', asset);
  return response.data;
};

export default {
  getAssets,
  createAsset,
  updateAssetByAssetId
};
