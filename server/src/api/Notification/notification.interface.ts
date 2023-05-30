import { Document, ObjectId } from 'mongoose';

export interface NotificationDocument extends Document {
  user: ObjectId | string;
  entity: string;
  entity_id: ObjectId | string;
  type: string;
  message: string;
  data: object;
  viewed?: boolean;
  dismissed?: boolean;
  visible?: boolean;
  seen?: boolean;
}

export interface NotificationInput {
  user: ObjectId | string;
  entity: string;
  entity_id: ObjectId | string;
  data: object;
  type: NotificationType;
}

export enum NotificationType {
  CHAT = 'Chat'
}
