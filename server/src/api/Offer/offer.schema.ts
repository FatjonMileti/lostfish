import mongoose, { Model, model, Schema } from 'mongoose';
import { OfferDocument } from './offer.interface';

const OfferSchema = new Schema<OfferDocument>({
  match: { type: String, required: true },
  offering_price: { type: Number, required: true },
  warranty: { type: String, required: true },
  min_duration: { type: String, required: true },
  canceled: { type: Boolean, default: false },
  property: { type: Schema.Types.ObjectId, ref: 'property' },
  created_by: { type: Schema.Types.ObjectId, ref: 'user' },
  created_for: { type: Schema.Types.ObjectId, ref: 'user' },
  refused: { type: Boolean, default: false },
  accepted: {
    accepted_date: { type: Date },
    status: { type: Boolean, default: false }
  },
  created_at: { type: Date, required: true, default: () => new Date() }
});
const OfferModel: Model<OfferDocument> = mongoose.model<OfferDocument>('offer', OfferSchema);

export default OfferModel;
