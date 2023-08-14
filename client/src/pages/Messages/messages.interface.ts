interface IChatUser {
  first_name: string;
  last_name: string;
  username: string;
  _id: string;
}

interface ILastMessage {
  message: string;
}

export interface IMessageBody {
  room_id: string;
  message: string;
  sender: string;
}

export interface IMessageItem extends IMessageBody {
  participant: string;
  author: any;
  time: string;
  sender: any;
  isCurrentUser?: boolean;
}

export interface IRoom {
  author: IChatUser;
  participant: IChatUser;
  last_message: ILastMessage | null;
  property: object;
  _id: string;
}
