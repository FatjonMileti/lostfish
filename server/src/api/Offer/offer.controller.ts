import { Request, Response, Router } from 'express';
import OfferService from './offer.service';
import MatchService from '../Match/match.service';
import createError from 'http-errors';
import { MatchingType } from '../Match/match.interface';
import roomService from '../Chat/room.service';

const router: Router = Router();

export class OfferController {
  public router = router;
  private offerService: OfferService;
  private matchService: MatchService;

  constructor(offerService: OfferService, matchService: MatchService) {
    this.offerService = offerService;
    this.matchService = matchService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', this.createOffer);
    this.router.get('/matches/:matchId/offer', this.getOfferByMatchId);
    this.router.patch('/:offerId/canceled', this.cancelOffer);
    this.router.delete('/:offerId', this.refuseOffer);
  }

  public createOffer = async (req: Request, res: Response) => {
    try {
      const offer = req.body;

      const match = await this.matchService.findMatchById(offer.match);

      if (!match) {
        return res.status(400).json({ error: 'Match not found' });
      }

      const newOffer = await this.offerService.createOffer({
        ...offer,
        created_by: res.locals.user_id,
        created_for: match.landlord,
        property: match.property
      });

      res.status(201).send(newOffer);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Unable to create a offer.' });
    }
  };

  public getOfferByMatchId = async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const match = await this.matchService.findMatchById(matchId);

    if (!match) {
      return res.status(400).json({ error: 'Match not found' });
    }

    let offer;

    console.log('match.type:', match.type);

    if (match.type === MatchingType.USER) {
      offer = await this.offerService.getOfferByQuery({
        match: matchId,
        created_by: res.locals.user_id,
        canceled: false
      });
    } else {
      offer = await this.offerService.getOfferByQuery({
        property: match.property,
        created_for: match.landlord,
        created_by: match.tenant,
        canceled: false
      });
    }

    if (!offer) {
      throw createError(404, { message: 'offer_not_found' });
    }

    res.send(offer);
  };

  public cancelOffer = async (req: Request, res: Response) => {
    try {
      const { offerId } = req.params;

      const offer = await this.offerService.getOfferByQuery({
        _id: offerId,
        created_by: res.locals.user_id,
        canceled: false
      });

      if (!offer) {
        throw createError(400, { message: 'offer_not_found' });
      }

      const canceledOffer = await this.offerService.cancelOffer(offerId);

      res.status(201).send(canceledOffer);
    } catch (err) {
      return res.status(500).json({ error: 'Unable to cancel offer.' });
    }
  };

  public refuseOffer = async (req: Request, res: Response) => {
    const { offerId } = req.params;

    const offer = await this.offerService.getOfferByQuery({
      _id: offerId,
      created_for: res.locals.user_id,
      canceled: false,
      refused: false
    });

    if (!offer) {
      throw createError(400, { message: 'offer_not_found' });
    }

    const refusedOffer = this.offerService.refuseOffer(offerId);

    res.status(201).send(refusedOffer);
  };
}
