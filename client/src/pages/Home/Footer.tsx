import { styled } from '@mui/system';
import React from 'react';

import LogoPlusTextBlack from '../../assets/images/LogoPlusTextBlack.svg';
import { SocialAccountButton } from '../../components/SocialAccountButton';
import { Label } from '../../components/Label';

export const Footer = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`footer-section ${className}`}>
      <img className='logo' alt='logo' src={LogoPlusTextBlack} />
      <div className='links-row'>
        <Label variant='tertiary'>How Lostfish works</Label>
        <Label variant='tertiary'>Terms & Conditions</Label>
        <Label variant='tertiary'> Privacy Policy</Label>
      </div>
      <div className='social-networks'>
        <SocialAccountButton icon='facebook-f' />
        <SocialAccountButton icon='twitter' />
        <SocialAccountButton icon='instagram' />
        <SocialAccountButton icon='linkedin-in' />
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
    }

    .social-networks {
      display: flex;
      align-items: center;
      column-gap: 8px;
    }
  }
`;
