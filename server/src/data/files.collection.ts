import { Schema, model, Document } from 'mongoose';

export interface IFiles extends Document {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: string;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: string;
  contentEncoding: string;
  storageClass: string;
  serverSideEncryption: any;
  metadata: any[];
  location: string;
  etag: any;
  versionId: string;
  destination: string;
  filename: string;
  path: string;
  expires_in: Date;
  created_at: Date;
}

const schema = new Schema<IFiles>({
  fieldname: { type: String },
  originalname: { type: String },
  encoding: { type: String },
  mimetype: { type: String },
  size: { type: String },
  bucket: { type: String },
  key: { type: String },
  acl: { type: String },
  contentType: { type: String },
  contentDisposition: { type: String },
  contentEncoding: { type: String },
  storageClass: { type: String },
  serverSideEncryption: { type: Object, default: null },
  metadata: { type: [Object], default: [] },
  location: { type: String },
  etag: { type: Object },
  versionId: { type: String },
  destination: { type: String },
  filename: { type: String },
  path: { type: String },
  created_at: { type: Date, default: new Date() }
});
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IFiles>('file', schema);
