import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Textarea } from '../../components/Textarea';
import { motion } from 'framer-motion';

import avatar1 from './images/avatar1.svg';
import avatar2 from './images/avatar2.svg';
import avatar3 from './images/avatar3.svg';
import avatar4 from './images/avatar4.svg';
import avatar5 from './images/avatar5.svg';
import { Icon } from '../../components/Icon';

const avatars = [
  {
    image: avatar1,
    backgroundColor: '#F7AC75'
  },
  {
    image: avatar2,
    backgroundColor: '#FDDF44'
  },
  {
    image: avatar3,
    backgroundColor: '#3DE2E2'
  },
  {
    image: avatar4,
    backgroundColor: '#184D6D'
  },
  {
    image: avatar5,
    backgroundColor: '#408140'
  }
];

export const ProfileDetails = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [selectedAvatar, setSelectedAvatar] = React.useState(0);

  return (
    <div className={`profile-details ${className}`}>
      <div className='left-part'>
        <div className='section'>
          <Typography className='section-title' variant='body4'>
            Contact information
          </Typography>
          <div className='contact-information'>
            <TextField label='First Name' required />
            <TextField label='Last Name' required />
            <TextField label='Email' required />
            <TextField label='Phone' />
          </div>
        </div>

        <div className='section'>
          <Typography className='section-title' variant='body4'>
            Personal details
          </Typography>
          <div className='personal-details'>
            <Textarea
              rows={6}
              label='Describe yourself (your matches will see this)'
              defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '></Textarea>
          </div>
        </div>

        <div className='section'>
          <Typography className='section-title' variant='body4'>
            Setup avatar
          </Typography>
          <div className='setup-avatar'>
            {avatars.map(({ image, backgroundColor }, avatarIndex) => {
              return (
                <motion.div
                  // whileTap={{ scale: 0.9 }}
                  // whileHover={{ scale: 1.5 }}
                  onClick={() => setSelectedAvatar(avatarIndex)}
                  key={avatarIndex}
                  className={`avatar ${avatarIndex === selectedAvatar ? 'active' : ''}`}
                  style={{ backgroundColor }}>
                  <img src={image} />
                  <Icon icon='checked' color='black' size={10} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <div className='right-part'>
        <Button disabled>Save changes</Button>
      </div>
    </div>
  );
})`
  &.profile-details {
    display: grid;
    grid-template-columns: 50% 50%;
    min-height: 100%;

    .left-part {
      display: grid;
      row-gap: 32px;
      align-content: flex-start;
    }

    .right-part {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }

    .section {
      display: grid;
      row-gap: 16px;
      .section-title {
        color: #646464;
      }
    }

    .contact-information {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
    }

    .personal-details {
    }

    .setup-avatar {
      display: flex;
      column-gap: 20px;

      .avatar {
        position: relative;
        border-radius: 50%;
        cursor: pointer;
        height: 72px;
        width: 72px;
        box-sizing: border-box;
        display: flex;

        img {
          border-radius: 50%;
        }

        &.active {
          outline: 2px solid #c0daff;

          :before {
            content: '';
            z-index: 1;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            border: 2px solid #c0daff;
            position: absolute;
          }

          .icon {
            position: absolute;
            z-index: 4;
            bottom: -8px;
            background: #c0daff;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 50%;
            padding: 4px;
          }
        }
      }
    }
  }
`;
