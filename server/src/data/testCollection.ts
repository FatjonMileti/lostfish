import { Schema, model, ObjectId, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ITestCollection extends Document {
    _id: ObjectId | string;
    uniqueId: string;
    isCompany: boolean;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    source?: string;
    county?: ObjectId | string;
    city?: ObjectId | string;

    editedAt?: Date;
    editedBy?: ObjectId | string;
    createdAt: Date;
    createdBy?: ObjectId | string;
}

const schema = new Schema<ITestCollection>({
    uniqueId: { type: String, index: true, required: true, unique: true },
    isCompany: { type: Boolean, required: true },
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    phone: String,
    source: String,
    county: { type: Schema.Types.ObjectId, ref: 'county' },
    city: { type: Schema.Types.ObjectId, ref: 'city' },

    editedAt: Date,
    editedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, required: true, default: () => new Date() },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' }
});
schema.plugin(mongoosePaginate);

export default model<ITestCollection, PaginateModel<ITestCollection>>('test.collection', schema);
