import { Schema, model, PaginateModel } from "mongoose";
import { Role } from "../enums";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserDocument } from "../api/User/user.interface";

const schema = new Schema<UserDocument>({
  username: { type: String, index: true, required: true, unique: true }, //email
  hash: String,
  role: {
    type: String,
    enum: [Role.Admin],
    required: true,
  },
  email: { type: String, index: true, required: true },
  phone: String,
  firstName: String,
  lastName: String,

  isDisabled: { type: Boolean, required: true },
  lastLogin: Date,

  editedAt: Date,
  editedBy: { type: Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, required: true, default: () => new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
});
schema.plugin(mongoosePaginate);

export default model<UserDocument, PaginateModel<UserDocument>>("user", schema);
