import { model, PaginateModel, Schema } from "mongoose";
import { Role } from "../enums";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserDocument } from "./interfaces/user.interface";

const schema = new Schema<UserDocument>({
  username: { type: String, index: true },
  hash: String,
  role: {
    type: String,
    enum: [Role.Admin, Role.User],
    default: Role.User,
    // required: true,
  },
  email: { type: String, index: true, required: true },
  phone: String,
  first_name: String,
  last_name: String,
  is_disabled: { type: Boolean, default: true },
  confirmation_token: String,
  last_login: Date,
  address: {
    name: String,
    street: String,
  },
  edited_at: Date,
  edited_by: { type: Schema.Types.ObjectId, ref: "user" },
  created_at: { type: Date, required: true, default: () => new Date() },
  created_by: { type: Schema.Types.ObjectId, ref: "user" },
});

schema.plugin(mongoosePaginate);

export default model<UserDocument, PaginateModel<UserDocument>>("user", schema);
