import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import React from 'react';
import { styled } from '@mui/system';

export const WhatDoWeDo = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`what-do-we-do-section ${className}`}>
      <Typography variant='menu' className='text3'>
        What we do?
      </Typography>
      <Typography variant='body2' className='text4'>
        Connecting tenants & landlords seamlessly
      </Typography>
      <div className='cards-layout'>
        <Card className='card card1'>
          <div className='content-wrapper'>
            <div>
              <Typography variant='body1'>How LostFish works</Typography>
              <Typography variant='body4' className='watch-demo'>
                Watch a quick demo now
              </Typography>
            </div>
            <Button className='play-demo-button'>Play demo</Button>
          </div>
        </Card>
        <Card className='card2'>
          <Typography variant='body1'>Explore Kensington</Typography>
        </Card>
        <Card className='card3'>
          <Typography variant='h1'>3,194</Typography>
          <Typography variant='body4'>Tenants</Typography>
        </Card>
        <Card className='card4'>
          <Typography variant='h1'>17,841</Typography>
          <Typography variant='body4'>Sellers</Typography>
        </Card>
      </div>
    </div>
  );
})`
  &.what-do-we-do-section {
    margin-top: 88px;
    .text3 {
      text-align: center;
    }

    .text4 {
      margin-top: 24px;
      text-align: center;
    }

    .cards-layout {
      display: grid;

      gap: 24px;
      grid-template-columns: 1fr 1fr 1fr 1fr;

      grid-template-areas:
        'a a b b'
        'a a b b'
        'a a c d';

      padding-inline: 36px;

      margin-top: 48px;

      .card1 {
        grid-area: a;

        height: 499px;

        background-image: url('./images/howLostFishWorks.svg');
        background-repeat: no-repeat;
        background-color: #eee0d3;
        background-blend-mode: multiply;
        background-position: top;
        background-size: contain;

        display: flex;

        .content-wrapper {
          //display: grid;
          //grid-template-columns: auto max-content;

          display: flex;
          width: 100%;
          justify-content: space-between;
          align-self: flex-end;

          .watch-demo {
            margin-top: 8px;
          }

          .play-demo-button {
            align-self: flex-end;

            background-color: #e5155a;
            color: white;
            border: none;
          }
        }
      }

      .card2 {
        grid-area: b;
        display: flex;
        background-color: red;
        height: 305px;

        background-image: url('./images/exploreKensington.png');
        background-repeat: no-repeat;
        background-size: cover;

        .typography {
          color: white;
          max-width: 270px;

          align-self: flex-end;
        }
      }

      .card3 {
        grid-area: c;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        row-gap: 8px;
        height: 170px;

        background-color: #184d6d;

        .typography {
          color: white;
        }
      }

      .card4 {
        grid-area: d;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        row-gap: 8px;
        height: 170px;
        background-color: #c0daff;

        .typography {
          color: #184d6d;
        }
      }
    }
  }
`;
