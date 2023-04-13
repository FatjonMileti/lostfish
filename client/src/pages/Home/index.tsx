import styled from '@emotion/styled';

import React from 'react';
import { Header } from './Header';
import { Typography } from '../../components/Typography';

import Illustration1 from '../../assets/images/illustration1.png';
import illustration2 from '../../assets/images/illustration2.png';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import Icon from '../../components/Icon';

import { Footer } from './Footer';
import { IconButton } from '../../components/IconButton';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='background-image-section'>
        <Header />
        <div className='title-and-decription'>
          <Typography variant='h1'>Welcome to Lostfish.</Typography>
          <Typography variant='body4' className='text2'>
            Our aim is to revolutionise the property industry by utilising technology and data to empower and
            inform customers in the buying, selling, and renting process.
          </Typography>
          <Typography variant='body2' className='text3'>
            What’s in it for you?
          </Typography>
        </div>
        <div className='looking-for-section'>
          <Typography variant='body4'>I’m looking for a tenant</Typography>
          <div className='circles'>
            <div className='circle first'>
              <IconButton className='plus-button'>
                <Icon icon='plus' size={24} color='white' />
              </IconButton>
            </div>
            <div className='circle second'>
              <IconButton className='plus-button'>
                <Icon icon='plus' size={24} color='white' />
              </IconButton>
            </div>
          </div>
          <Typography variant='body4'>I’m looking for a place</Typography>
        </div>
      </div>
      <img className='illustration1' src={Illustration1} alt='illustration' />
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
      <div className='daily-new-section'>
        <div className='left-content'>
          <img src='images/dailyNews.png' alt='dayly news' />
        </div>
        <div className='right-content'>
          <div className='header'>
            <Typography variant='menu' className='daily-news-title'>
              DAILY NEWS
            </Typography>
            <div className='icons-wrapper'>
              <Icon icon='share' size={18} color='white' />
              <Icon icon='label-vertical' size={18} color='white' />
            </div>
          </div>
          <Typography variant='body1' className='body-text-1'>
            Experts predict a dip in property prices
          </Typography>
          <Typography variant='body4' className='body-text-2'>
            Experts are saying there’s going to be a decrease in London property prices in the upcoming
            months, and provide information on how you can benefit.
          </Typography>
          <div className='daily-news-footer'>
            <Typography variant='body4' className='progress-tracker'>
              1/3
            </Typography>
            <Icon icon='arrow-right' size={36} color='white' />
          </div>
        </div>
      </div>
      <div className='illustration-2-section'>
        <img src={illustration2} />
      </div>
      <div className='what-defines-us-section'>
        <Typography variant='menu' className='section-title'>
          WHAT defines us?
        </Typography>
        <div className='cards-wrapper'>
          <Card className='no-waiting'>
            <Typography variant='body3'>No waiting, no chasing,  no middlemen.</Typography>
            <Typography variant='body4'>
              Our goal is to increase transparency and trust in the process to achieve the best results for
              customers in a quick, calm, and informed manner.
            </Typography>
          </Card>
          <Card className='find-your-dream'>
            <Typography variant='body3'>Find your dream home, with AI-powered precision.</Typography>
            <Typography variant='body4'>
              We aim to revolutionise the property industry by utilising technology and data to empower and
              inform customers in the buying, selling, and renting process.
            </Typography>
          </Card>
          <Card className='hassle-free'>
            <Typography variant='body3'>Hassle-free housing.</Typography>
            <Typography variant='body4'>
              We want to create a stress-free environment where you have access to unbiased and real-time
              information, as well as support and guidance at every stage of the process.
            </Typography>
          </Card>
        </div>
      </div>
      <div className='join-our-community-section'>
        <Button variant='contained'>
          Join our community
          <Icon icon='arrow-right' size={28} />
        </Button>
      </div>
      <Footer />
    </div>
  );
})`
  max-width: 1440px;
  margin-inline: auto;

  .background-image-section {
    background-image: url('./images/homePageBackground.png');
    background-repeat: no-repeat;
    background-size: cover;
    padding-bottom: 52px;

    .title-and-decription {
      margin-inline: auto;
      max-width: 904px;
      margin-top: 64px;
      text-align: center;

      display: flex;
      flex-direction: column;
      align-items: center;

      .text2 {
        margin-top: 24px;
        max-width: 672px;
      }

      .text3 {
        margin-top: 64px;
      }
    }

    .looking-for-section {
      margin-top: 84px;

      display: flex;
      align-items: center;

      column-gap: 72px;
      justify-content: center;
      .typography {
        color: #184d6d;
      }

      .circles {
        width: 568px;
        height: 324px;
        position: relative;

        .circle {
          display: inline-block;
          border-radius: 50%;
          width: 324px;
          height: 324px;

          mix-blend-mode: multiply;
          transition: all 0.5s;
          cursor: pointer;

          &.first {
            background-color: red;
            background-image: url('./images/imLookingForTenant.png');
            position: absolute;
            left: 0;

            :hover {
              z-index: 1;
              transform: scale(1.2);
            }

            .plus-button {
              position: absolute;
              bottom: calc(50% - 24px);
              left: -24px;
              background-color: #e5155a;
              border: none;
            }
          }

          &.second {
            background-color: #eee0d3;
            background-blend-mode: darken;

            background-image: url('./images/imLookingForPlace.png');
            background-size: 276px;
            background-position: center;
            background-repeat: no-repeat;

            position: absolute;
            right: 0;

            :hover {
              z-index: 1;
              transform: scale(1.2);
            }

            .plus-button {
              position: absolute;
              bottom: calc(50% - 24px);
              right: -24px;
              background-color: #e5155a;
              border: none;
            }
          }
        }
      }
    }
  }

  .illustration1 {
    width: 100%;
    height: auto;
  }

  .daily-new-section {
    margin-top: 88px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .left-content {
      display: flex;
      img {
        width: 100%;
      }
    }

    .right-content {
      padding: 118px 140px;
      background-color: #184d6d;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .daily-news-title {
          color: #c0daff;
        }

        .icons-wrapper {
          display: flex;
          column-gap: 32px;
        }
      }

      .body-text-1 {
        margin-top: 88px;
        color: white;
      }

      .body-text-2 {
        margin-top: 16px;
        color: white;
      }

      .daily-news-footer {
        margin-top: 88px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .progress-tracker {
          color: white;
          font-size: 18px;
        }
      }
    }
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

  .text3 {
    margin-top: 88px;
    text-align: center;
  }

  .text4 {
    margin-top: 24px;
    text-align: center;
  }

  .illustration-2-section {
    margin-top: 88px;
    padding-inline: 36px;
    display: flex;
    img {
      width: 100%;
    }
  }

  .what-defines-us-section {
    margin-top: 88px;
    padding-inline: 36px;

    .section-title {
      text-align: center;
    }

    .cards-wrapper {
      margin-top: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      column-gap: 24px;

      .card {
        display: flex;
        flex-direction: column;
        row-gap: 16px;
        justify-content: space-between;
        padding: 48px;
      }

      .no-waiting {
        background-color: #e7e7e7;
      }

      .find-your-dream {
        background-color: #c0daff;
      }

      .hassle-free {
        background-color: #eee0d3;
      }
    }
  }

  .join-our-community-section {
    margin-top: 48px;
    display: flex;
    justify-content: center;
    button {
      text-transform: none;
      display: flex;
      column-gap: 10px;
      align-items: center;
    }
  }
`;
