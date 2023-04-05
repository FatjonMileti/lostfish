import axios from '../../utils';

const getAll = async () => {
  const response = await axios.get('/asset/get');
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
      date_go_live: '2019-08-24T14:15:22Z',
      date_offer_deadline: '2019-08-24T14:15:22Z',
      date_exchanged: '2019-08-24',
      date_completion: '2019-08-24',
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

  data.description = JSON.stringify(data);
  try {
    return await axios.post('/asset/post', data);
  } catch (error: any) {
    return error;
  }
};

export default { getAll, createAsset };
