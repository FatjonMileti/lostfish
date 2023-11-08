import React, { HTMLAttributes } from 'react';
import { styled } from '@mui/system';

import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { Backdrop } from '../../../components/Backdrop';
import { useAgreement } from '../useAgreement';
import hand from '../images/hand.png';
import propertyImage from '../images/property.png';
import { DashboardYourProperties } from './Dashboard.YourProperties';
import { useProfileStore } from '../../../globalState/profile';
import { DashboardPropertyStatistics } from './Dashboard.PropertyStatistics';

export const Dashboard = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { loading, getTransactionAgreementStatus, buttonLabel, handleTransactionAgreement } = useAgreement();
  const profileStore = useProfileStore();

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

      {profileStore.role === 'Landlord' && (
        <>
          <DashboardYourProperties />
          <DashboardPropertyStatistics />
        </>
      )}
      {profileStore.role === 'Tenant' && (
        <>
          <div />
          {/*<SummaryStarredProperties />*/}
        </>
      )}
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
        background-image: url('${propertyImage}');
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
    }
  }
`;
