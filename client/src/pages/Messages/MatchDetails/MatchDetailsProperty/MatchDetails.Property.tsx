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
import { MakeAnOfferModal } from './MakeAnOfferModal';
interface MatchDetailsPropertyProps extends HTMLAttributes<HTMLDivElement> {
  room: IRoom;
}

export const MatchDetailsProperty = styled(({ className, room }: MatchDetailsPropertyProps) => {
  const userStore = useUserStore();
  const [offerModalVisibility, setOfferModalVisibility] = React.useState(false);

  const avatarKey = room.property_match?.landlord.avatar;

  const avatar = getAvatarFormIndex(avatarKey);

  const fullName = `${room.property_match?.landlord?.first_name} ${room.property_match?.landlord?.last_name}`;

  const property = room.property;

  return (
    <>
      <div className={classNames('match-details-property', className)}>
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
                £10,850.00 - £18,930.00
              </Typography>
              <div className='according-to-and-logo'>
                <Typography variant='body6' className='according-to'>
                  According to
                </Typography>
                <img src={logoValpal} alt='lavpal logo' />
              </div>
            </div>
          </div>

          <Label className='make-an-offer-button' onClick={() => setOfferModalVisibility(true)}>
            Make an offer
          </Label>

          <div className='divider' />

          <div className={`landlord-details ${className}`}>
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
            <Label special variant='secondary'>
              <Icon icon='dislike' size={24} />
              Unmatch
            </Label>
            <Label variant='secondary'>
              <Icon icon='email' />
              Report
            </Label>
          </div>
        </div>
      </div>
      <MakeAnOfferModal
        room={room}
        open={offerModalVisibility}
        onBackdropClick={() => setOfferModalVisibility(false)}
      />
    </>
  );
})`
  &.match-details-property {
    border-radius: 12px;
    background: #f7f1e7;
    box-shadow: 0 16px 32px 0 rgba(0, 0, 0, 0.12);

    display: grid;

    align-self: flex-start;

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
