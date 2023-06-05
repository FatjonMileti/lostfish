import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';

import { Typography } from '../../components/Typography';
import verified from './images/verified.svg';
import { Link } from '../../components/Link';
import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';
import avatar4 from './images/avatar4.svg';
import avatar5 from './images/avatar5.svg';

import property from './images/property.png';
import property1 from './images/property1.png';

const avatars = [
  {
    image: avatar1,
    backgroundColor: '#F7AC75',
    name: 'Nancy Jones'
  },
  {
    image: avatar2,
    backgroundColor: '#FDDF44',
    name: 'Nick Young'
  },
  {
    image: avatar3,
    backgroundColor: '#3DE2E2',
    name: 'Nick Young'
  },
  {
    image: avatar4,
    backgroundColor: '#184D6D',
    name: 'Toby Anderson'
  },
  {
    image: avatar5,
    backgroundColor: '#408140',
    name: 'Mark Williamson'
  }
];

import { Tabs, Tab } from '../../components/Tab';
import { Button } from '../../components/Button';

export const StarredMatches = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={`starred-matches ${className}`}>
      <Tabs value={activeTab} onChange={(i: any) => setActiveTab(i)} variant='secondary'>
        <Tab label='Tenants' />
        <Tab label='Properties' />
      </Tabs>
      {activeTab === 0 && (
        <div className='tenants-tab'>
          <Typography variant='body5'>You will only see starred matches from your current search.</Typography>
          <div className='tenants'>
            {avatars.map(({ image, backgroundColor }, tenantIndex) => {
              return (
                <div className='tenant'>
                  <img
                    style={{ backgroundColor }}
                    className='profile-image'
                    src={image}
                    alt='tenant profile'
                  />
                  <Typography className='tenant-name' variant='body4'>
                    Nancy Jones
                    <img src={verified} alt='verified' />
                  </Typography>
                  <Link>View profile</Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 1 && (
        <div className='properties-tab'>
          <Typography variant='body5'>You will only see starred matches from your current search.</Typography>
          <div className='properties'>
            <div className='starred-property'>
              <img className='property-background-image' alt='property-image' src={property} />
              <div className='property-footer'>
                <Typography className='property-title' variant='body4'>
                  Two bed flat with terrace
                </Typography>
                <div className='details'>
                  <div className='match-percentage'>
                    <Typography variant='body5'>100%</Typography>
                  </div>
                  <Button size='small' variant='secondary' inverted className='details-button'>
                    Property details
                  </Button>
                </div>
              </div>
            </div>

            <div className='starred-property'>
              <img className='property-background-image' alt='property-image' src={property1} />
              <div className='property-footer'>
                <Typography className='property-title' variant='body4'>
                  Two bedroom apartment for rent
                </Typography>
                <div className='details'>
                  <div className='match-percentage'>
                    <Typography variant='body5'>96%</Typography>
                  </div>
                  <Button size='small' variant='secondary' inverted className='details-button'>
                    Property details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
})`
  &.starred-matches {
    display: grid;
    row-gap: 32px;

    .tab {
      width: 100px;
    }

    .tenants-tab {
      display: grid;
      row-gap: 32px;
      .tenants {
        display: flex;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;
        .tenant {
          display: grid;
          justify-items: center;
          row-gap: 8px;
          align-content: flex-start;

          .profile-image {
            border-radius: 50%;
            aspect-ratio: 1/1;
            width: 208px;
          }

          .tenant-name {
            font-weight: 700;
            display: grid;
            grid-template-columns: max-content min-content;
            align-items: center;
            column-gap: 8px;
          }
        }
      }
    }

    .properties-tab {
      display: grid;
      row-gap: 32px;

      .properties {
        display: flex;
        flex-wrap: wrap;
        column-gap: 24px;
        row-gap: 24px;
        .starred-property {
          border-radius: 16px;
          display: flex;
          aspect-ratio: 1.35 / 1;
          height: 326px;
          position: relative;

          .property-background-image {
            position: absolute;
            border-radius: 16px;
          }

          .property-footer {
            background: rgba(38, 38, 38, 0.7);
            backdrop-filter: blur(10px);
            align-self: flex-end;
            width: 100%;
            border-radius: 0 0 16px 16px;
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
                background-color: #e5155a;
                border-radius: 8px;
                color: white;
                padding: 4px 8px;
                box-sizing: border-box;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
`;
