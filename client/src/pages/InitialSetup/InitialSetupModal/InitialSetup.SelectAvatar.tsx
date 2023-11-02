import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';

import { Button } from '../../../components/Button';
import { ArrowButton } from '../../../components/ArrowButton';
import { Typography } from '../../../components/Typography';
import { Avatar } from '../../../components/Avatar';

import { avatars } from '../../HomeLoggedIn/avatars';
import classNames from 'classnames';

export interface SelectAvatarProps extends HTMLAttributes<HTMLDivElement> {
  onSelectAvatar: (avatarIndex: number) => void;
}

export const SelectAvatar = styled(({ className, onSelectAvatar }: SelectAvatarProps) => {
  const [avatar, setSelectedAvatar] = React.useState(0);
  const handleNextClick = () => {
    setSelectedAvatar(avatar === avatars.length - 1 ? 0 : avatar + 1);
  };

  const handlePrevClick = () => {
    setSelectedAvatar(avatar === 0 ? avatars.length - 1 : avatar - 1);
  };

  return (
    <div className={classNames('select-avatar', className)}>
      <div className='select-avatar-content'>
        <Typography variant='h3' className='title'>
          Welcome to Lostfish
        </Typography>
        <Typography variant='body4' className='description'>
          Select an avatar to start building your trust score. The higher your trust score is, the more
          accurate matches will be shown to you.
        </Typography>

        <div className='avatars-list'>
          {avatars.map(({ image, backgroundColor }, avatarIndex) => {
            const active = avatarIndex === avatar;
            return (
              <Avatar
                image={avatars[avatarIndex].image}
                animate={{
                  x: `calc(${-100 * avatar}% - ${avatar * 24}px)`,
                  opacity: avatarIndex === avatar ? 1 : 0.5
                }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedAvatar(avatarIndex)}
                key={avatarIndex}
                className={classNames({ active })}
              />
            );
          })}
        </div>
      </div>

      <div className='action-buttons'>
        <ArrowButton size='large' direction='left' onClick={handlePrevClick} />

        <ArrowButton size='large' direction='right' onClick={handleNextClick} />
      </div>
    </div>
  );
})`
  &.select-avatar {
    box-sizing: border-box;
    display: grid;
    justify-content: center;
    overflow-x: hidden;

    .select-avatar-content {
      display: grid;
      justify-items: center;
      width: 672px;

      .title,
      .description {
        text-align: center;
      }

      .description {
        text-align: center;
        margin-top: 16px;
      }

      .avatars-list {
        margin-top: 48px;
        display: flex;
        width: 400px;
        column-gap: 24px;
        padding: 48px;

        .avatar {
          position: relative;
          width: 400px;
          height: 400px;
          overflow: hidden;
          flex-shrink: 0;
          opacity: 0.5;
          cursor: pointer;
          box-sizing: border-box;

          &.active {
            opacity: 1;
            position: relative;
            z-index: 1;

            border: 4px solid #e5155a;
            /* Large card shadow */
            box-shadow: 0 4px 48px 0 rgba(0, 0, 0, 0.04);
          }
        }
      }
    }

    .action-buttons {
      margin-top: 52px;
      display: flex;
      column-gap: 24px;
      justify-content: center;

      align-items: center;
      width: 100%;
    }
  }
`;
