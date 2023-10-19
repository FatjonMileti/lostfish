import { styled } from '@mui/system';
import React from 'react';
import { Link } from '../../components/Link';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';

import LogoPlusTextBlack from '../../assets/images/LogoPlusTextBlack.svg';

export const Footer = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`footer-section ${className}`}>
      <img className='logo' alt='logo' src={LogoPlusTextBlack} />
      <div className='links-row'>
        <Link variant='body4'>How Lostfish works</Link>
        <Link variant='body4'>Terms & Conditions</Link>
        <Link variant='body4'>Privacy Policy</Link>
      </div>
      <div className='social-networks'>
        <IconButton size='large'>
          <Icon icon='facebook-f' size={16} />
        </IconButton>
        <IconButton size='large'>
          <Icon icon='twitter' size={16} />
        </IconButton>
        <IconButton size='large'>
          <Icon icon='instagram' size={16} />
        </IconButton>
        <IconButton size='large'>
          <Icon icon='linkedin-in' size={16} />
        </IconButton>
      </div>
    </div>
  );
})`
  &.footer-section {
    padding: 36px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    
    .logo {
      align-self: center;
    }

    .links-row {
      display: flex;
      column-gap: 24px;
      align-items: center;
      padding: 12px 0;

      > .link .typography {
        color: #184d6d;
      }
    }

    .social-networks {
      display: flex;
      align-items: flex-start;
      column-gap: 8px;

      .icon-button {
        background-color: #fff;
        padding: 16px;

        :hover {
          background-color: #0d2a38;
          color: white;
        }
      }
    }
  }
`;
