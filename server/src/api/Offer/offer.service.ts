import { OfferDocument } from './offer.interface';
import { FilterQuery, Model } from 'mongoose';

export default class OfferService {
  private offerModel: Model<OfferDocument>;
  constructor(offerModel: Model<OfferDocument>) {
    this.offerModel = offerModel;
  }

  public async createOffer(data: Partial<OfferDocument>) {
    return await this.offerModel.create(data);
  }

  public async getOfferByQuery(query: FilterQuery<OfferDocument> | undefined): Promise<OfferDocument | null> {
    return this.offerModel.findOne(query).sort({ created_at: -1 });
  }

  public async cancelOffer(offerId: string) {
    return this.offerModel.updateOne({ _id: offerId }, { $set: { canceled: true } });
  }

  public async refuseOffer(offerId: string) {
    return this.offerModel.updateOne({ _id: offerId }, { $set: { refused: true } });
  }
}
