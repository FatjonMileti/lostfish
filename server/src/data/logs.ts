import { Schema, model, ObjectId, Document, Model, PaginateModel } from 'mongoose';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate-v2';

export enum LoginLogAction {
  Login = 'login',
  Refresh = 'refresh',
  Logout = 'logout',
  Login_Google = 'login_google'
}

export interface ILoginLog extends Document {
  user: ObjectId | string;
  action: LoginLogAction;
  info?: object;
  date: Date;
  expiresAt: Date;
}

export enum LogAction {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export interface ILog extends Document {
  user: ObjectId | string;
  action: LogAction;
  ref?: ObjectId | string;
  info?: object;
  date: Date;
  expiresAt: Date;
}

/* Login log schema */
const loginLogSchema = new Schema<ILoginLog>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: [LoginLogAction.Login, LoginLogAction.Refresh, LoginLogAction.Logout],
    required: true
  },
  info: Object,
  date: { type: Date, required: true, default: () => new Date() },
  expiresAt: {
    type: Date,
    default: () => {
      return moment().add(parseInt(process.env.LOG_EXPIRATION_DAYS!, 10), 'day').toDate();
    }
  }
});
loginLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
loginLogSchema.plugin(mongoosePaginate);
export const LoginLog = model<ILoginLog, PaginateModel<ILoginLog>>('login.log', loginLogSchema);

const generateModel: (collection: string) => PaginateModel<ILog> = (collection: string) => {
  const schema = new Schema<ILog>({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    action: {
      type: String,
      enum: [LogAction.Create, LogAction.Read, LogAction.Update, LogAction.Delete],
      required: true
    },
    ref: { type: Schema.Types.ObjectId, ref: collection, index: true },
    info: Object,
    date: { type: Date, required: true, default: () => new Date() },
    expiresAt: {
      type: Date,
      default: () => {
        return moment().add(parseInt(process.env.LOG_EXPIRATION_DAYS!, 10), 'day').toDate();
      }
    }
  });
  schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  schema.plugin(mongoosePaginate);
  return model<ILog, PaginateModel<ILog>>(`${collection}.log`, schema);
};

export const UserLog = generateModel('user');
export const MatchLog = generateModel('match');
export const AssetLog = generateModel('asset');
