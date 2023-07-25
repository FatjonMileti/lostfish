import offrIoRequest from '../offr-io.request';
import { AssetDocument, MasterAssetTypeSring } from '../api/Asset/asset.interface';
import { AxiosResponse } from 'axios';
import { UserDocument } from '../api/User/user.interface';
import { getCurrentPropertyTypeForPost } from '../api/Asset/helpers';

const createContact = async (contact: UserDocument) => {
  const postData = {
    firstname: contact.first_name,
    surname: contact.last_name,
    legal_name: `${contact.first_name} ${contact.last_name}`,
    email: contact.email,
    phone: '0693189373',
    // company: contact.company,
    // contact_type: contact.contact_type,
    address: contact.address
  };
  const response = await offrIoRequest.post('/contact/post', postData);
  return response.data;
};

const getAssets = async (): Promise<any[]> => {
  const response = await offrIoRequest.get('/asset/get');
  return response.data.items;
};

const updateAssetByAssetId = async (assetId: number, body: AssetDocument) => {
  const data = mapAssetBeforePost(body);

  return await offrIoRequest.patch('/asset/patch/' + assetId, {
    name: data.name,
    asset_address: data.asset_address,
    status_string: data.status_string,
    transaction_type_string: data.transaction_type_string,
    master_asset_type_string: data.master_asset_type_string,
    // asset_type_string: data.asset_type_string,
    asset_attribute: data.asset_attribute
    // client_id: 861,
    // client: {
    //   firstname: 'Refail',
    //   surname: 'Gjeli',
    //   legal_name: 'Mr',
    //   email: 'refail.gjeli@fullscreendigital.ro',
    //   phone: '0693189373',
    //   company: 'Test',
    //   contact_type: 'Client',
    //   address: 'Tirane, Albania'
    // }
  });
};

const mapAssetBeforePost = (asset: AssetDocument): AssetDocument => {
  asset.asset_attribute = [
    { name: 'number_of_bedrooms', type: 'Number', value: asset.room_details.number_of_bedrooms },
    { name: 'number_of_bathrooms', type: 'Number', value: asset.room_details.number_of_bathrooms },
    { name: 'floor_size', type: 'Number', value: asset.floor_size },
    { name: 'floor_size_unit', type: 'Select', value: asset.floor_size_unit }
  ];
  asset.master_asset_type_string = MasterAssetTypeSring.Residential;
  // asset.asset_type_string = getCurrentPropertyTypeForPost(asset.property_type);

  return asset;
};

const createAsset = async (asset: AssetDocument) => {
  const data = mapAssetBeforePost(asset);
  const response = await offrIoRequest.post('/asset/post', data);
  return response.data;
};

const addAssetDocument = async (images: any[], assetId: number) => {
  enum AssetDocumentType {
    Image = 'Image',
    Document = 'Document'
  }

  const imagesToPost = images.map((image: any) => {
    return {
      id: image.filename,
      asset_id: assetId,
      data: `https://www.udr.com/globalassets/corporate/homepage/homepage_4_1274towson.jpg`,
      filename: image.originalName,
      caption: '',
      type: AssetDocumentType.Image,
      subtype: image.originalName.split('.')[1]
    };
  });

  const postData = (data: any): Promise<AxiosResponse> => {
    return offrIoRequest.post('/asset_file/post', data);
  };
  const promisesArray: Promise<AxiosResponse>[] = imagesToPost.map((data: any) => postData(data));

  return Promise.all(promisesArray)
    .then((responses: AxiosResponse[]) => {
      return responses.map((response: AxiosResponse) => response.data);
    })
    .catch((error: any) => {
      // Handle any errors that occurred during the requests
      return error;
    });
};

export default {
  getAssets,
  createAsset,
  updateAssetByAssetId,
  addAssetDocument,
  createContact
};
