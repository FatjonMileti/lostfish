export enum ContactType {
  Client = 'Client',
  Solicitor = 'Solicitor',
  Agent = 'Agent',
  Unknown = 'Unknown'
}

export type DocumentType = 'Employer reference' | 'Landlord reference' | 'Proof of ID';

export interface IUser_Documents {
  type: DocumentType;
  key: string;
  approved: boolean;
  mimetype: string;
  originalName: string;
  link?: string;
}

export const DOCUMENT_TYPES: IUser_Documents[] = [
  {
    type: 'Proof of ID',
    key: '',
    link: '',
    approved: false,
    mimetype: '',
    originalName: ''
  },
  {
    type: 'Employer reference',
    key: '',
    link: '',
    approved: false,
    mimetype: '',
    originalName: ''
  },
  {
    type: 'Landlord reference',
    key: '',
    link: '',
    approved: false,
    mimetype: '',
    originalName: ''
  }
];

export interface ApiUserDocumentType {
  _id: string;
  user_id: number;
  hash: string;
  role: {
    type: Role;
    default: Role.User;
  };
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
}

export enum Role {
  Admin = 'Admin',
  Guest = 'Guest',
  User = 'User'
}
