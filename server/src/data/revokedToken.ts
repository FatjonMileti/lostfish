import { Schema, model, ObjectId, Document } from "mongoose";

export interface IRevokedToken extends Document {
  token: string;
  expiresAt: Date;
}

const schema = new Schema<IRevokedToken>({
  token: { type: String, index: true },
  expiresAt: Date,
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IRevokedToken>("revoked.token", schema);
