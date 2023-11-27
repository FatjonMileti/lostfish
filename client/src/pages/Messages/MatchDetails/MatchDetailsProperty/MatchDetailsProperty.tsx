import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { IRoom } from '../../messages.interface';
import { useUserStore } from '../../../../globalState/user';
import { getAvatarFormIndex } from '../../../HomeLoggedIn/avatars';

import { Avatar } from '../../../../components/Avatar';
import { Typography } from '../../../../components/Typography';
import { Label } from '../../../../components/Label';
import { Icon } from '../../../../components/Icon';

import logoValpal from '../../../../assets/svg/logo-valpal.png';
import { MakeAnOfferModal, OfferFormType } from './MakeAnOfferModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../../../../utils/axios';
import { ShowGlobalLoading } from '../../../../components/ShowGlobalLoading';
import { ApiOfferDocument, ReviewOfferModal } from './MatchDetailsproperty.ReviewOfferModal';
import { Documents } from '../../Documents/Documents';
interface MatchDetailsPropertyProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
  fetchChatRooms: () => any;
}

export const MatchDetailsProperty = styled(
  ({ className, room, fetchChatRooms }: MatchDetailsPropertyProps) => {
    const userStore = useUserStore();
    const [offerModalVisibility, setOfferModalVisibility] = React.useState(false);

    const [reviewOfferModalVisibility, setReviewOfferModalVisibility] = React.useState(false);

    const avatarKey = room.property_match?.landlord.avatar;

    const avatar = getAvatarFormIndex(avatarKey);

    const fullName = `${room.property_match?.landlord?.first_name} ${room.property_match?.landlord?.last_name}`;

    const property = room.property;

    const offerQuery = useQuery<ApiOfferDocument>({
      queryKey: ['offer', room.tenant_match?._id],
      queryFn: async () => {
        try {
          const { data } = await axios(userStore.auth.access_token).get(
            `/api/offer/matches/${room.tenant_match?._id}/offer`
          );
          return data;
        } catch (err: any) {
          if (err?.response?.status === 404) {
            return null;
          }

          throw err;
        }
      },
      refetchOnWindowFocus: false,
      retry: false,
      refetchIntervalInBackground: false
    });

    const makeOffer = useMutation<ApiOfferDocument, unknown, OfferFormType>({
      mutationFn: async (data: OfferFormType) => {
        const { data: offer } = await axios(userStore.auth.access_token).post<ApiOfferDocument>(
          '/api/offer',
          {
            offering_price: data.offeringPrice,
            min_duration: data.minDuration,
            warranty: data.warranty,
            match: room?.tenant_match?._id
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return offer;
      },
      onSuccess: () => {
        setOfferModalVisibility(false);
        offerQuery.refetch();
      }
    });

    const cancelOffer = useMutation<ApiOfferDocument, unknown, string>({
      mutationFn: async (offerId: string) => {
        const { data } = await axios(userStore.auth.access_token).patch<ApiOfferDocument>(
          `/api/offer/${offerId}/canceled`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data;
      },
      onSuccess: () => {
        setReviewOfferModalVisibility(false);
        offerQuery.refetch();
      }
    });

    const unmatchProperty = useMutation({
      mutationFn: (matchId: string) => {
        return axios(userStore.auth.access_token).patch(`/api/match/${matchId}/unmatched`);
      },
      onSuccess: () => {
        fetchChatRooms();
      }
    });

    return (
      <>
        {offerQuery.isFetching && <ShowGlobalLoading />}

        <div
          className={classNames('match-details-property', className, {
            'offer-sent': !!offerQuery.data,
            'offer-accepted': offerQuery?.data?.accepted?.status,
            unmatched: room.tenant_match?.unmatched
          })}>
          <div
            className='property-details'
            style={{
              backgroundImage: room.property.property_images?.[0].link
            }}>
            <div className='details'>
              <Typography variant='body5' className='property-title'>
                {room.property.title}
              </Typography>

              <div className='details-list'>
                <div className='detail'>
                  <Icon icon='location' />
                  <Typography variant='body5'>{room.property.area_of_interest}</Typography>
                </div>

                <Typography variant='body4' className='dot'>
                  •
                </Typography>

                <div className='detail'>
                  <Icon icon='double-bed' />
                  <Typography variant='body5'>{room.property.room_details?.number_of_bedrooms}</Typography>
                </div>

                <Typography variant='body4' className='dot'>
                  •
                </Typography>
                <div className='detail'>
                  <Icon icon='bathtub' />
                  <Typography variant='body5'>{room.property.room_details?.number_of_bathrooms}</Typography>
                </div>
              </div>
            </div>
          </div>

          <div className='sections'>
            {!room.tenant_match?.unmatched && !room.property_match?.unmatched && (
              <>
                {!offerQuery.data?.accepted?.status && (
                  <div className='price-details'>
                    <div className='warranty-and-period'>
                      <div>
                        <Typography variant='body6' className='price-detail-title'>
                          Warranty (advance):
                        </Typography>
                        <Typography variant='body4' className='price-detail-value'>
                          2 months
                        </Typography>
                      </div>
                      <div>
                        <Typography variant='body6' className='price-detail-title'>
                          Period:
                        </Typography>
                        <Typography variant='body4' className='price-detail-value'>
                          2 years
                        </Typography>
                      </div>
                    </div>
                    <div>
                      <Typography variant='body6' className='price-detail-title'>
                        Asking price
                      </Typography>
                      <Typography variant='body4' className='price-detail-value'>
                        {`£${property?.budget?.min_budget?.toLocaleString()} - £${property?.budget?.max_budget.toLocaleString()}`}
                      </Typography>
                    </div>
                    <div className='valpal-evaluation'>
                      <Typography variant='body6' className='price-detail-title'>
                        Places like this usually go for:
                      </Typography>
                      <Typography variant='body4' className='price-detail-value'>
                        £2,000 - £2,500
                      </Typography>
                      <div className='according-to-and-logo'>
                        <Typography variant='body6' className='according-to'>
                          According to
                        </Typography>
                        <img src={logoValpal} alt='lavpal logo' />
                      </div>
                    </div>
                  </div>
                )}

                {!offerQuery.isFetching && !offerQuery.data && (
                  <Label className='make-an-offer-button' onClick={() => setOfferModalVisibility(true)}>
                    Make an offer
                  </Label>
                )}
                {!offerQuery.isFetching && !!offerQuery.data && (
                  <>
                    {!offerQuery.data.refused && !offerQuery.data?.accepted?.status && (
                      <div className='offer-sent-informative-text'>
                        <Typography variant='body6' className='offer-sent-title'>
                          <Icon icon='checked-o' />
                          Your offer was sent to the landlord
                        </Typography>
                        <Typography variant='body6' className='offer-sent-description'>
                          Any updates to your offer will appear here.
                        </Typography>
                      </div>
                    )}

                    {offerQuery.data?.accepted?.status && (
                      <>
                        <div className='offer-accepted-wrapper'>
                          <div className='offer-accepted-informative-text'>
                            <Icon icon='checked-o' />
                            <Typography variant='body6' className='offer-sent-title'>
                              Your offer was accepted
                            </Typography>
                          </div>
                          <Typography variant='body6'>
                            In order to complete the transaction, you will need to provide us with some
                            documents. Once you have all the documents uploaded you can complete the
                            transaction.
                          </Typography>
                        </div>
                        <Documents room={room} />
                      </>
                    )}

                    {offerQuery.data.refused && (
                      <>
                        <div className='offer-rejected-informative-text'>
                          <Icon icon='close-o' />
                          <Typography variant='body6' className='offer-sent-title'>
                            Your offer was rejected
                          </Typography>
                        </div>
                        <Typography variant='body6'>
                          Your initial offer was rejected by the landlord. You can still make another offer.
                        </Typography>

                        <Label className='make-an-offer-button' onClick={() => setOfferModalVisibility(true)}>
                          Make another offer
                        </Label>
                      </>
                    )}

                    {!!offerQuery.data && !offerQuery.data.refused && !offerQuery.data?.accepted?.status && (
                      <Label
                        variant='secondary'
                        className='make-an-offer-button'
                        onClick={() => setReviewOfferModalVisibility(true)}>
                        Review offer
                      </Label>
                    )}
                  </>
                )}

                <div className='divider' />

                <div className='landlord-details'>
                  <Avatar image={avatar} />

                  <div className='details'>
                    <Typography variant='body4' className='name'>
                      {fullName}
                    </Typography>
                    <Typography variant='body6' className='matched-date'>
                      {'Matched on '}
                      {room.property_match?.created_at &&
                        moment(room.property_match.created_at).format('MMMM Do YYYY')}
                    </Typography>
                  </div>
                </div>

                <div className='action-buttons'>
                  <Label
                    special
                    variant='secondary'
                    onClick={() => {
                      if (room.property_match?._id) {
                        unmatchProperty.mutate(room.property_match?._id);
                      }
                    }}>
                    <Icon icon='dislike' size={24} />
                    Unmatch
                  </Label>
                  <Label variant='secondary'>
                    <Icon icon='email' />
                    Report
                  </Label>
                </div>
              </>
            )}

            {room.tenant_match?.unmatched && (
              <div className='landlord-unmatched-wrapper'>
                <div className='offer-rejected-informative-text'>
                  <Icon icon='close-o' />
                  <Typography variant='body6' className='offer-sent-title'>
                    You have been unmatched
                  </Typography>
                </div>

                <Label className='delete-conversation-button' variant='secondary'>
                  <Icon icon='trash' size={20} />
                  Delete conversation
                </Label>
              </div>
            )}

            {room.property_match?.unmatched && (
              <div className='tenant-unmatched-wrapper'>
                <div className='texts-wrapper'>
                  <div className='offer-rejected-informative-text'>
                    <Icon icon='close-o' />
                    <Typography variant='body6' className='offer-sent-title'>
                      You unmatched this property
                    </Typography>
                  </div>
                  <Typography variant='body6'>
                    You are no longer matched with this property. Your history conversation will remain
                    visible for 90 days or you can delete it whenever you want.
                  </Typography>
                </div>

                <Label className='delete-conversation-button' variant='secondary'>
                  Delete conversation
                </Label>
              </div>
            )}
          </div>
        </div>
        <MakeAnOfferModal
          room={room}
          open={offerModalVisibility}
          onBackdropClick={() => setOfferModalVisibility(false)}
          makeOffer={makeOffer}
        />
        {!offerQuery.isFetching && !!offerQuery.data && (
          <ReviewOfferModal
            room={room}
            open={reviewOfferModalVisibility}
            onBackdropClick={() => setReviewOfferModalVisibility(false)}
            offer={offerQuery.data}
            cancelOffer={cancelOffer}
          />
        )}
      </>
    );
  }
)`
  &.match-details-property {
    border-radius: 12px;
    background: #f7f1e7;
    box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.12);

    display: grid;
    align-self: flex-start;

    &.offer-sent {
      box-shadow: 0px 16px 32px 0px rgba(64, 129, 64, 0.25);
    }

    &.offer-accepted {
      box-shadow: 0px 16px 32px 0px rgba(64, 129, 64, 0.25);
    }

    &.unmatched {
      box-shadow: 0px 16px 32px 0px rgba(180, 38, 59, 0.25);
    }

    .property-details {
      display: grid;

      align-content: flex-end;
      //height: 180px;
      aspect-ratio: 1.62/1;
      border-radius: 12px 12px 0 0;

      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%),
        url('${(props) => props.room.property.property_images?.[0]?.link}'), lightgray 50% / cover no-repeat;

      box-shadow: 0 0.43687px 5.2424px 0 rgba(0, 0, 0, 0.04);
      background-size: cover;
      background-position: center;

      .details {
        padding: 12px;
        display: grid;
        row-gap: 4px;
        .property-title {
          color: white;
          font-weight: 700;
        }

        .details-list {
          color: white;
          font-weight: 700;
          display: flex;
          column-gap: 8px;
          align-items: center;

          .detail {
            display: flex;
            column-gap: 4px;
            align-items: center;
          }

          .dot {
            color: #a7a7a7;
          }
        }
      }
    }

    .sections {
      padding: 16px;
      row-gap: 16px;
      display: grid;

      .offer-sent-informative-text {
        padding: 12px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid #cfe0cf;
        background: #e2ece2;
        color: #408140;
        display: grid;
        row-gap: 4px;

        .offer-sent-title {
          font-weight: 600;
          display: flex;
          align-items: center;
          column-gap: 4px;

          .icon {
            width: 16px !important;
            height: 16px !important;
          }
        }

        .offer-sent-description {
          font-weight: 500;
        }
      }

      .offer-rejected-informative-text {
        display: flex;
        column-gap: 4px;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid #ecc9ce;
        background: #f4dee2;
        color: #b4263b;

        font-weight: 700;

        .icon {
          width: 16px !important;
          height: 16px !important;
        }
      }

      .offer-accepted-wrapper {
        display: grid;
        row-gap: 8px;

        .offer-accepted-informative-text {
          display: flex;
          column-gap: 4px;
          align-items: center;
          padding: 12px;
          box-sizing: border-box;
          border-radius: 8px;
          border: 1px solid #cfe0cf;
          background: #e2ece2;
          color: #408140;

          font-weight: 700;

          .icon {
            width: 16px !important;
            height: 16px !important;
          }
        }
      }

      .landlord-unmatched-wrapper {
        display: grid;
        row-gap: 16px;

        .delete-conversation-button {
          width: 100%;
        }
      }

      .tenant-unmatched-wrapper {
        display: grid;
        row-gap: 24px;
        .texts-wrapper {
          display: grid;
          row-gap: 8px;

          .offer-rejected-informative-text {
            display: flex;
            column-gap: 4px;
            align-items: center;
            padding: 12px;
            box-sizing: border-box;
            border-radius: 8px;
            border: 1px solid #ecc9ce;
            background: #f4dee2;
            color: #b4263b;

            font-weight: 700;

            .icon {
              width: 16px !important;
              height: 16px !important;
            }
          }
        }

        .delete-conversation-button {
          width: 100%;
        }
      }

      .price-details {
        display: grid;
        row-gap: 16px;

        .warranty-and-period {
          display: grid;
          column-gap: 16px;
          grid-template-columns: 1fr 1fr;
        }

        .price-detail-title {
          font-weight: 500;
        }

        .price-detail-value {
          font-weight: 700;
        }

        .valpal-evaluation {
          display: grid;
          row-gap: 4px;

          .according-to-and-logo {
            display: flex;
            column-gap: 8px;
            align-items: center;

            .according-to {
              color: #cfd5d5;
              font-weight: 500;
              font-style: italic;
            }

            img {
              height: 24px;
              width: auto;
            }
          }
        }
      }

      .landlord-details {
        display: flex;
        column-gap: 8px;

        .details {
          display: flex;
          flex-direction: column;
          row-gap: 8px;

          .name {
            color: #0d2a38;
            font-weight: 700;
          }

          .matched-date {
            color: #a7a7a7;
          }
        }
      }

      .make-an-offer-button {
        width: 100%;
      }

      .divider {
        background: #e7e7e7;
        height: 2px;
      }

      .action-buttons {
        display: flex;
        column-gap: 16px;

        .label {
          flex-grow: 1;
        }
      }
    }
  }
`;
