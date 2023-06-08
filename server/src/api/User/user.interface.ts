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

export interface UserDocument extends ContactUser {
  user_id: number;
  hash: string;
  role: Role;
  email: string;
  first_name: string;
  last_name: string;
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
  confirmation_token?: string;
  last_login: Date;
  edited_at?: Date;
  edited_by?: ObjectId | string;
  created_at: Date;
  created_by?: ObjectId | string;
}

export enum Role {
  Admin = 'Admin',
  Agent = 'Agent',
  Client = 'Client',
  Solicitor = 'Solicitor'
}
