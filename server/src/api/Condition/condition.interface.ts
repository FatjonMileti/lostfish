import { Document, ObjectId } from 'mongoose';

export enum IType {
  Number = 'Number',
  Text = 'Text',
  TextArea = 'TextArea',
  Select = 'Select',
  Range = 'Range'
}

export interface ConditionDocument extends Document {
  condition_id: number;
  name: string;
  label: string;
  description: string;
  help: string;
  type_string: IType;
  required: boolean;
  is_system: boolean;
  created_at: Date;
  created_by?: ObjectId | string;
}
