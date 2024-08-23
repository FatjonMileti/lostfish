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
import { MatchedPropertyType } from '../../../Matches/matches.type.ts';
import { ViewProperty } from '../../../Matches/MatchesProperties/ViewProperty.tsx';
interface MatchDetailsPropertyProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
  fetchChatRooms: () => any;
}

export const MatchDetailsProperty = styled(
  ({ className, room, fetchChatRooms }: MatchDetailsPropertyProps) => {
    const userStore = useUserStore();
    const [offerModalVisibility, setOfferModalVisibility] = React.useState(false);

    const [reviewOfferModalVisibility, setReviewOfferModalVisibility] = React.useState(false);

    const [propertyToView, setPropertyToView] = React.useState(null);

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

    const matchedProperty: any = {};
    matchedProperty.property = property;
    matchedProperty.property.created_by = room.property_match?.landlord;
    matchedProperty.matched = true;
    matchedProperty.property.percentage = property?.percentage || 34;

    return (
      <>
        {offerQuery.isFetching && <ShowGlobalLoading />}

        <div className={classNames('match-details-property', className)}>
          <div className='property-details'>
            <div className='landlord-details'>
              <Avatar image={avatar} />
              <div className='details'>
                <Typography variant='body4' className='fullname'>
                  {fullName}
                </Typography>
                <Typography variant='body6' className='matched-on'>
                  Matched on {moment(room.tenant_match?.created_at).format('DD.MM.YYYY')}
                </Typography>
              </div>
            </div>
            <div className='offer-section-wrapper'>
              <div className='offer-section'>
                <div className='section-title'>
                  <Icon icon='fast-message' size={24} />
                  <Typography variant='body4' className='title'>
                    Make an offer
                  </Typography>
                </div>
                <Typography variant='body4' className='description'>
                  You can chat with your match before and after you make an offer. Once accepted, the terms of
                  the offer can’t be changed.
                </Typography>
              </div>
              <Label
                variant='special'
                size='large'
                className='offer-button'
                onClick={() => setOfferModalVisibility(true)}>
                Make an offer
              </Label>
            </div>
            <div className='divider' />
            <div className='match-section-wrapper'>
              <div className='match-section'>
                <Typography variant='body4' className='title'>
                  About your match
                </Typography>
                <Typography variant='body4' className='description'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                  labor...
                </Typography>
              </div>
              <Label variant='secondary' onClick={() => setPropertyToView(matchedProperty)}>
                Match details
              </Label>
            </div>
          </div>
          <div className='buttons'>
            <Label variant='tertiary'>Get help</Label>
            <Label variant='tertiary'>Report user</Label>
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
        {propertyToView && (
          <ViewProperty
            open={true}
            closeModal={() => setPropertyToView(null)}
            onBackdropClick={() => setPropertyToView(null)}
            propertyMatch={propertyToView}
            dislikeProperty={() => {
              if (room.property_match?._id) {
                unmatchProperty.mutate(room.property_match?._id);
              }
            }}
            chatWith={() => setPropertyToView(null)}
          />
        )}
      </>
    );
  }
)`
  &.match-details-property {
    border-radius: 16px;
    display: grid;
    padding: 24px;
    align-content: space-between;
    box-sizing: border-box;
    height: 100%;
    grid-auto-rows: min-content min-content;

    .property-details {
      display: grid;
      gap: 24px;

      .landlord-details {
        display: flex;
        gap: 16px;

        .details {
          display: flex;
          flex-direction: column;
          row-gap: 8px;

          .fullname {
            color: #0d2a38;
            font-weight: 700;
          }

          .matched-on {
            color: #a7a7a7;
            font-weight: 500;
            line-height: 20px;
          }
        }
      }

      .offer-section-wrapper {
        display: grid;
        gap: 16px;

        .offer-section {
          display: grid;
          gap: 16px;

          .section-title {
            display: flex;
            align-items: center;
            gap: 8px;

            .title {
              font-size: 18px;
              font-weight: 900;
              color: #0d2a38;
            }
          }

          .description {
            color: #0d2a38;
            font-weight: 500;
          }
        }

        .offer-button {
          width: 100%;
        }
      }

      .divider {
        background: #e7e7e7;
        height: 1px;
      }

      .match-section-wrapper {
        display: grid;
        gap: 16px;

        .match-section {
          display: grid;
          gap: 16px;

          .title {
            font-size: 16px;
            font-weight: 700;
            color: #0d2a38;
          }

          .description {
            color: #0d2a38;
            font-weight: 500;
          }
        }

        .offer-button {
          width: 100%;
        }
      }
    }

    .buttons {
      display: flex;
      gap: 40px;
      justify-content: flex-end;
    }
  }
`;
