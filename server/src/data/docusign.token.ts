import { Schema, model, ObjectId, Document } from 'mongoose';

export interface IDocusignToken extends Document {
  token: string;
  expires_in: Date;
  created_at: Date;
}

const schema = new Schema<IDocusignToken>({
  token: { type: String, index: true },
  expires_in: Date,
  created_at: { type: Date, default: new Date() }
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IDocusignToken>('docusign.token', schema);
