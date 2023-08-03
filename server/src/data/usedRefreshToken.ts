import { Schema, model, ObjectId, Document } from 'mongoose';

export interface IUsedRefreshToken extends Document {
  token: string;
  expiresAt: Date;
}

const schema = new Schema<IUsedRefreshToken>({
  token: { type: String, index: true },
  expiresAt: Date
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IUsedRefreshToken>('used.refresh.token', schema);
