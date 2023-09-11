import { Document, ObjectId } from 'mongoose';

export enum ContactType {
  Client = 'Client',
  Solicitor = 'Solicitor',
  Agent = 'Agent',
  Unknown = 'Unknown'
}

export type DocumentType = 'Employer reference' | 'Landlord reference' | 'Proof of ID';

export interface IUserDocuments {
  type: DocumentType;
  key: string;
  approved: boolean;
  mimetype: string;
  link?: string;
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
  age: number;
  description: string;
  avatar: string;
  notification: {
    email_me_when_i_get_a_match: boolean;
    text_when_i_get_a_match: boolean;
    email_when_someone_accept_my_match: boolean;
    text_when_someone_accept_my_match: boolean;
  };
  documents: IUserDocuments[];
  address: string;
  martial_status: string;
  have_pets: boolean;
  agreed_application_policy: boolean;
  signed_transaction_agreement: boolean;
  transaction_agreement_link: string;
  role: Role;
  hash: string;
  last_login: Date;
  confirmation_token?: string;
  rules?: any;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
  deleted_at?: Date;
}

export enum Role {
  Agent = 'Agent',
  Client = 'Tenant',
  Landlord = 'Landlord',
  NeWUser = 'NewUser'
}
