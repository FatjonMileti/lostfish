import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';

import { Button } from '../../components/Button';
import { ArrowButton } from '../../components/ArrowButton';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';

import { avatars } from '../HomeLoggedIn/avatars';

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
    <div className={className}>
      <div className='select-avatar-content'>
        <Typography variant='h3' className='title'>
          Welcome to Lostfish
        </Typography>
        <Typography variant='body4' className='description'>
          Maximise your chances of finding your perfect match by improving your trust score. You can start
          improving your trust score by selecting an avatar.
        </Typography>
        <div className='avatars-list'>
          {avatars.map(({ image, backgroundColor }, avatarIndex) => {
            return (
              <Avatar
                image={avatars[avatarIndex].image}
                animate={{
                  x: `calc(${-100 * avatar}% + ${32 * avatar}px)`,
                  opacity: avatarIndex === avatar ? 1 : 0.5
                }}
                transition={{ ease: 'easeOut', duration: 0.5 }}
                onClick={() => setSelectedAvatar(avatarIndex)}
                key={avatarIndex}
                className={`${avatarIndex === avatar ? 'active' : ''}`}
              />
            );
          })}
        </div>
        <div className='action-buttons'>
          <ArrowButton size='large' direction='left' onClick={handlePrevClick} />
          <Button size='large' onClick={() => onSelectAvatar(avatar)}>
            Select avatar
          </Button>
          <ArrowButton size='large' direction='right' onClick={handleNextClick} />
        </div>
      </div>
    </div>
  );
})`
  & {
    box-sizing: border-box;
    display: grid;
    justify-content: center;
    overflow-x: hidden;

    .select-avatar-content {
      display: grid;
      justify-items: center;
      width: 672px;
      padding: 48px;

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

        .avatar {
          position: relative;
          width: 400px;
          height: 400px;
          overflow: hidden;
          flex-shrink: 0;
          opacity: 0.5;
          margin-left: -32px;
          cursor: pointer;
          box-sizing: border-box;
          &:first-of-type {
            margin-left: 0;
          }

          &.active {
            opacity: 1;
            position: relative;
            z-index: 1;
            border: 4px solid var(--primary-brand-sand, #eee0d3);
          }
        }
      }

      .action-buttons {
        margin-top: 52px;
        display: grid;
        grid-template-columns: min-content min-content min-content;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
    }
  }
`;
