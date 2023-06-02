import { Document, ObjectId } from 'mongoose';

export enum IType {
  Number = 'Number',
  Text = 'Text',
  TextArea = 'TextArea',
  Select = 'Select',
  Range = 'Range'
}

export interface AttributeDocument extends Document {
  attribute_id: number;
  name: string;
  label: string;
  description: string;
  fieldset: string;
  type: IType;
  required: boolean;
  multiple: string;
  max_length: number;
  min_value: number;
  max_value: number;
  pattern: string;
  option: [{ group: string; label: string }];
  created_at: Date;
  created_by?: ObjectId | string;
}
