import React, { HTMLAttributes } from 'react';
import { styled } from '@mui/system';

import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { Avatar } from '../../components/Avatar';

import hand from './images/hand.png';
import property from './images/property.png';
import verified from './images/verified.svg';

import { avatars } from '../HomeLoggedIn/avatars';
import { Backdrop } from '../../components/Backdrop';
import { useAgreement } from './useAgreement';
import { Icon } from '../../components/Icon';
import backgroundImg from './images/background.png';

export const Dashboard = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { loading, getTransactionAgreementStatus, buttonLabel, handleTransactionAgreement } = useAgreement();

  return (
    <div className={`dashboard ${className}`}>
      <Backdrop open={loading}></Backdrop>
      <div className='transaction-agreement'>
        <div className='left-part'>
          <Typography className='title' variant='body4'>
            {getTransactionAgreementStatus()}
          </Typography>

          <Typography variant='body5' className='description'>
            The transaction agreement serves as a guarantee for both you, your match and Lostfish that
            everything will be covered following the ongoing UK laws.
          </Typography>

          <Button
            size='small'
            variant='secondary'
            className='sign-button'
            onClick={() => handleTransactionAgreement()}>
            {buttonLabel()}
          </Button>
        </div>
      </div>
        <div className='starred-properties'>
          <Typography className='title' variant='body4'>
            Recently starred properties
          </Typography>

          <div className='starred-property'>
            <div className='property-footer'>
              <Typography className='property-title' variant='body4'>
                Two bedroom apartment for rent
              </Typography>
              <div className='details'>
                <div className='match-percentage'>
                  <div className='detail'>
                    <Icon icon='location' />
                    <Typography variant='body5'>Bristol</Typography>
                  </div>
                  <div className='detail'>
                    <Icon icon='banknote' />
                    <Typography variant='body5'>£1,150 PCM</Typography>
                  </div>
                </div>
                <Button size='small' variant='secondary' inverted className='details-button'>
                  Edit property
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className='starred-tenants'>
          <Typography className='title' variant='body4'>
            Recently starred tenants
          </Typography>

          <div className='tenants'>
            {/*<div className='tenant'>*/}
            {/*  <Avatar image={avatars[0].image} className='profile-image' />*/}
            {/*  <Typography className='tenant-name' variant='body4'>*/}
            {/*    Nancy Jones*/}
            {/*    <img src={verified} alt='verified' />*/}
            {/*  </Typography>*/}
            {/*  <Link>View profile</Link>*/}
            {/*</div>*/}

            {[
              {
                id: 0,
                first_name: 'Nancy',
                last_name: 'Jones',
                email: 'Sincere@april.biz',
                avatar: '3'
              },
              {
                id: 1,
                first_name: 'Nick',
                last_name: 'Young',
                email: 'Sincere@april.biz',
                avatar: '1'
              }
            ].map((match, i) => (
              <div
                className='avatar'
                key={i}
                style={{ backgroundImage: `url(${avatars[Number(match.avatar)].image})` }}>
                <div className='content'>
                  <div className='username'>
                    <Typography variant='body4'>
                      {`${match.first_name} ${match.last_name}`}
                      <img src={verified} alt='verified' />
                    </Typography>
                  </div>
                    <Button active={false} inverted>
                      View profile
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
})`
  &.dashboard {
    display: grid;
    grid-template-areas:
      'a a'
      'b c';
    gap: 32px 24px;
    grid-template-columns: 1fr 1fr;

    .transaction-agreement {
      box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      background-image: url('${hand}');
      background-repeat: no-repeat;
      background-position-x: right;
      grid-area: a;
      overflow: hidden;
      background-color: white;

      .left-part {
        padding: 24px;
        .title {
          font-size: 18px;
          font-weight: 700;
        }

        .description {
          margin-top: 16px;
        }

        .sign-button {
          margin-top: 24px;
          background-color: #184d6d;
          color: #fff;
        }
      }
    }

      .starred-properties {
        display: grid;
        row-gap: 16px;
        grid-template-rows: min-content auto;
        grid-area: b;

        .title {
          font-size: 18px;
          font-weight: 700;
        }

        .starred-property {
          background-image: url('${property}');
          border-radius: 12px;
          display: flex;
          aspect-ratio: 1.34 / 1;
          background-repeat: no-repeat;
          background-size: cover;

          .property-footer {
            background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.8) 43.75%);
            align-self: flex-end;
            width: 100%;
            border-radius: 0 0 12px 12px;
            padding: 16px;
            box-sizing: border-box;
            row-gap: 8px;
            display: flex;
            flex-direction: column;

            .property-title {
              color: white;
              font-weight: 700;
            }

            .details {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .match-percentage {
                color: white;
                font-weight: 700;
                display: flex;
                column-gap: 24px;
                align-items: center;

                .detail {
                  display: flex;
                  column-gap: 4px;
                  align-items: center;
                }
              }
              .details-button {
                padding: 12px 20px;
                font-size: 14px;
                line-height: 20px;
              }
            }
          }
        }
      }

      .starred-tenants {
        display: grid;
        row-gap: 16px;
        grid-template-rows: min-content auto;

        grid-area: c;

        .title {
          font-size: 18px;
          font-weight: 700;
        }

        .tenants {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 24px;
          //.tenant {
          //  display: grid;
          //  justify-items: center;
          //  row-gap: 8px;
          //  align-content: flex-start;
          //
          //  .profile-image {
          //    height: 208px;
          //    width: 208px;
          //  }
          //
          //  .tenant-name {
          //    font-weight: 700;
          //    display: grid;
          //    grid-template-columns: max-content min-content;
          //    align-items: center;
          //    column-gap: 8px;
          //  }
          //}

          .avatar {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            border-radius: 12px;
            box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.05);
            //aspect-ratio: 1 / 1.56;

            .content {
              display: flex;
              padding: 16px;
              flex-direction: column;
              align-items: center;
              gap: 16px;
              width: 100%;
              box-sizing: border-box;
              border-radius: 12px;
              background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 43.75%);

              .username {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 4px;

                .typography {
                  color: #fff;
                  font-weight: 700;
                  display: grid;
                  grid-template-columns: max-content min-content;
                  align-items: center;
                  column-gap: 8px;
                }
              }

           
                .button {
                  color: #fff;
                  background: none;
                  padding: 12px 20px;
                  border: 2px solid #fff;
                  border-radius: 250px;
                  font-family: Roobert, sans-serif;
                  font-size: 14px;
                  font-weight: 600;
                  width: 100%;
                  line-height: 20px;
                }
              
            }
          }
        }
      }
  }
`;
