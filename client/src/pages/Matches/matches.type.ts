import { ApiPropertyDocumentType } from '../Properties/NewProperty/property.types';
import { ApiUserDocumentType } from '../MyAccount/user.interface';

export interface SuggestedPropertyType {
  property: Omit<ApiPropertyDocumentType, 'created_by'> & {
    created_by: ApiUserDocumentType;
    percentage: string;
  };
  matchId?: string;
  chosen: boolean;
  starred: boolean;
  matched: boolean;
}

export interface SuggestedTenantType {
  id: string;
  criteria: any;
  property: ApiPropertyDocumentType | any;
  chosen: boolean;
  starred: boolean;
  matched: boolean;
  unread_messages: number;
  matchId?: string;
}

export interface MatchedPropertyType {
  id: string;
  criteria: any;
  property: ApiPropertyDocumentType | any;
  chosen: boolean;
  starred: boolean;
  matched: boolean;
  unread_messages: number;
  matchId?: string;
  _id: string;
}

export interface MatchedTenantType {
  id: string;
  criteria: any;
  property: ApiPropertyDocumentType | any;
  chosen: boolean;
  starred: boolean;
  matched: boolean;
  unread_messages: number;
  matchId?: string;
  _id: string;
}
