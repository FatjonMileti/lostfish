import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import verifiedIndicatorImage from '../MyAccount/images/verified.svg';
import { Button } from '../../components/Button';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

interface TenantMatchProps extends HTMLAttributes<HTMLDivElement> {
  fullName: string;
  verified?: boolean;
  viewProfile?: () => void;
  userId: string;
  avatar: string;
}

export const TenantMatch = styled(
  ({ className, fullName, verified = true, userId, viewProfile = () => {}, avatar }: TenantMatchProps) => {
    return (
      <div className={classNames(className, 'tenant-match')}>
        <div className='content'>
          <div className='username'>
            <Typography variant='body4'>
              {fullName}
              {verified && <img src={verifiedIndicatorImage} alt='verified' />}
            </Typography>
          </div>
          <Button variant='secondary' inverted onClick={viewProfile}>
            View profile
          </Button>
        </div>
      </div>
    );
  }
)`
  &.tenant-match {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    border-radius: 12px;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.05);
    aspect-ratio: 1 / 1.56;
    background-image: url(${(props) => props.avatar});

    height: 100%;
    //width: 100%;

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
          display: flex;
          align-items: center;
          column-gap: 8px;
          overflow-wrap: anywhere;
        }
      }

      .button {
        width: 100%;
      }
    }
  }
`;
