import request from '../../request';
import { UserDocument } from '../../data/interfaces/user.interface';

const create = async (contact: UserDocument) => {
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
  const response = await request.post('/contact/post', postData);
  return response.data;
};

export default { create };
