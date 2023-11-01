import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import { Avatar } from '../../components/Avatar';
import HomeImg from './89.png';
import TenantImg from './tenant_img.png';
import classNames from 'classnames';

import backgroundImg from './forest.jpeg';
export const SectionOne = styled(
  ({
    className,
    section2Ref
  }: HTMLAttributes<HTMLDivElement> & { section2Ref?: React.RefObject<HTMLDivElement> }) => {
    return (
      <div className={classNames('section-one', className)}>
        <div className='section-content'>
          <div className='welcome'>
            <Typography className='perfect-match'>
              Finding the <span className='perfect-match-red'>perfect match</span> between landlords and
              tenants
            </Typography>
            <Typography variant='body4' className='texts'>
              We use the power of AI to find landlords and tenants exactly what they are looking for.
              <br />
              The perfect match for their home or the perfect home for their match.
            </Typography>
          </div>

          <div className='refine-search'>
            <div className='match-intersection'>
              <Avatar image={TenantImg} className='left-side thumbnail' />
              <div className='right-side thumbnail'></div>
            </div>
            <Button variant='primary' size='large' className='start-matching'>
              Start matching
            </Button>
          </div>
        </div>
        <div className='bottom'>
          <Typography variant='body4'>Keen to find out how we’re doing it? </Typography>

          <div className='scroll-down-text-and-icon-wrapper'>
            <Label
              variant='tertiary'
              size='small'
              className='scroll-down'
              onClick={() => section2Ref?.current?.scrollIntoView({ behavior: 'smooth' })}>
              Scroll down
              <Icon icon='arrow-right' size={24} />
            </Label>
          </div>
        </div>
      </div>
    );
  }
)`
  &.section-one {
    position: relative;
    min-height: calc(100vh - 112px);
    display: grid;
    padding: 176px 36px 64px 36px;
    justify-content: center;
    align-content: space-between;
    box-sizing: border-box;
    row-gap: 32px;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(255, 251, 243, 0.9) 20%, rgba(255, 255, 255, 0.9) 100%)
        no-repeat;
      z-index: -1;
      top: -112px;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${backgroundImg});
      background-repeat: no-repeat;
      background-size: cover;
      opacity: 0.4;
      z-index: -2;
      top: -112px;
    }

    .section-content {
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

      .welcome {
        width: 904px;
        display: grid;
        align-items: center;
        gap: 24px;

        .perfect-match {
          text-align: center;
          font-size: 56px;
          font-weight: 400;
          line-height: 64px;

          .perfect-match-red {
            color: #e5155a;
          }
        }

        .texts {
          text-align: center;
          font-weight: 400;
        }
      }

      .refine-search {
        width: max-content;
        display: flex;
        padding: 12px;
        box-sizing: border-box;
        align-items: center;
        margin: 0 auto;
        gap: 24px;
        background-color: #fff;
        border-radius: 25000px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.05);

        .match-intersection {
          display: flex;

          .thumbnail {
            border-radius: 50%;
            height: 64px;
            width: 64px;
          }

          .left-side {
            position: relative;
            margin-right: -16px;
            overflow: hidden;
            :after {
              background-color: #ffffff;
              clip-path: circle(50%);
              width: 100%;
              height: 100%;
              content: '';
              position: absolute;
              left: calc(100% - 16px);
            }
          }

          .right-side {
            background-image: url(${HomeImg});
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
        }

        .start-matching {
          background-color: #e5155a;
          border: 1px solid #b4263b;
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;

      .scroll-down {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
        column-gap: 4px;

        .icon {
          rotate: 90deg;
        }
      }
    }
  }
`;
