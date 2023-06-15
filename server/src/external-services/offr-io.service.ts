import offrIoRequest from '../offr-io.request';
import { AssetDocument, MasterAssetTypeSring } from '../api/Asset/asset.interface';
import config from '../config';
import { AxiosResponse } from 'axios';
import { UserDocument } from '../api/User/user.interface';

const createContact = async (contact: UserDocument) => {
  const postData = {
    firstname: contact.first_name,
    surname: contact.last_name,
    legal_name: `${contact.first_name} ${contact.last_name}`,
    email: contact.email,
    phone: '0693189373',
    company: contact.company,
    contact_type: contact.contact_type,
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
  return await offrIoRequest.patch('/asset/patch/' + 2716, {
    name: body.name,
    asset_address: body.asset_address,
    status_string: body.status_string,
    transaction_type_string: body.transaction_type_string,
    master_asset_type_string: body.master_asset_type_string,
    asset_type_string: body.asset_type_string
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
    { name: 'Number of bedrooms', type: 'Number', value: asset.room_details.number_of_bedrooms },
    { name: 'Number of bathrooms', type: 'Number', value: asset.room_details.number_of_bathrooms }
  ];
  asset.master_asset_type_string = MasterAssetTypeSring.Residential;
  asset.asset_type_string = asset.property_type;
  return asset;
};

const createAsset = async (asset: AssetDocument) => {
  // const data = mapAssetBeforePost(asset);
  // const response = await offrIoRequest.post('/asset/post', data);
  // return response.data;
  return { id: 123 };
};

const addAssetDocument = async (images: any[], assetId: number) => {
  enum AssetDocumentType {
    Image = 'Image',
    Document = 'Document'
  }

  if (images.length > 0) {
    const imagesToPost = images.map((image: any) => {
      return {
        id: image.filename,
        asset_id: assetId,
        url: `${config.api_url}/url-to-file/${image.filename}`,
        filename: image.originalname,
        caption: '',
        type: AssetDocumentType.Image,
        subtype: image.originalname.split('.')[1]
      };
    });

    const postData = (data: any): Promise<AxiosResponse> => {
      return offrIoRequest.post('/asset_file/post', data);
    };
    const promisesArray: Promise<AxiosResponse>[] = imagesToPost.map((data: any) => postData(data));

    return Promise.all(promisesArray)
      .then((responses: AxiosResponse[]) => {
        // Handle the responses here
        console.log(responses);
      })
      .catch((error: any) => {
        // Handle any errors that occurred during the requests
        console.error(error);
      })
      .finally(() => {
        return true;
      });
  }
  return { message: 'no_images_to_add' };
};

export default {
  getAssets,
  createAsset,
  updateAssetByAssetId,
  addAssetDocument,
  createContact
};
