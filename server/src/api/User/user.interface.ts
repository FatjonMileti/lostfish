import { Document, ObjectId } from 'mongoose';

export enum ContactType {
  Client = 'Client',
  Solicitor = 'Solicitor',
  Agent = 'Agent',
  Unknown = 'Unknown'
}

interface ContactUser extends Document {
  contact_id: string;
  legal_name: string;
  company: string;
  contact_type: ContactType;
  address: string;
}

export interface UserDocument extends Document {
  first_name: string;
  last_name: string;
  email: string;
  is_disabled: boolean;
  google: {
    username: string;
    google_user_id: string;
    is_google_verified: boolean;
  };
  facebook: {
    username: string;
    facebook_user_id: string;
    is_facebook_verified: boolean;
  };
  twitter: {
    username: string;
    twitter_user_id: string;
    is_twitter_verified: boolean;
  };
  phone: string;
  description: string;
  avatar: string;
  notification: {
    email_me_when_i_get_a_match: boolean;
    text_when_i_get_a_match: boolean;
    email_when_someone_accept_my_match: boolean;
    text_when_someone_accept_my_match: boolean;
  };
  documents: any[];
  address: string;

  role: Role;
  hash: string;
  last_login: Date;
  confirmation_token?: string;
  rules?: any;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

export enum Role {
  Agent = 'Agent',
  Client = 'Tenant',
  Landlord = 'Landlord',
  NeWUser = 'NewUser'
}
