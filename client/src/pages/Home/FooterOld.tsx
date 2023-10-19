import { styled } from '@mui/system';
import React from 'react';
import { Typography } from '../../components/Typography';
import { Link } from '../../components/Link';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';

import LogoPlusTextWhite from '../../assets/images/LogoPlusTextWhite.svg';

export const Footer = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`footer-section ${className}`}>
      <div className='column-1'>
        <img className='logo' alt='logo' src={LogoPlusTextWhite} />

        <div className='social-networks'>
          <IconButton size='large' inverted>
            <Icon icon='facebook-f' color='white' size={16} />
          </IconButton>
          <IconButton size='large' inverted>
            <Icon icon='twitter' color='white' size={16} />
          </IconButton>
          <IconButton size='large' inverted>
            <Icon icon='instagram' color='white' size={16} />
          </IconButton>
          <IconButton size='large' inverted>
            <Icon icon='linkedin-in' color='white' size={16} />
          </IconButton>
        </div>
      </div>

      <div className='links-row'>
        <Link variant='body4'>About Lostfish</Link>
        <Link variant='body4'>How Lostfish works</Link>
        <Link variant='body4'>What defines us</Link>
        <Link variant='body4'>Terms & Conditions</Link>
        <Link variant='body4'>Privacy Policy</Link>
      </div>
      <div className='copyright-bar'>
        <Typography className='copyright-text' variant='body5'>
          2023 © LOSTFISH LIMITED. ALL RIGHTS RESERVED
        </Typography>

        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='scroll-up-button'
          size='large'
          inverted
          noBackground>
          <Icon icon='arrow-up' color='white' size={16} />
        </IconButton>
      </div>
    </div>
  );
})`
  &.footer-section {
    padding: 48px 36px;
    background-color: #0d2a38;
    display: grid;
    row-gap: 24px;

    .column-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;

      img.logo {
        height: 40px;
      }

      .typography {
        color: white;
      }

      .social-networks {
        display: flex;
        align-items: center;
        column-gap: 16px;

        .icon-button {
          border: 1px solid #184d6d;
        }
      }
    }

    .links-row {
      display: flex;
      column-gap: 32px;
      align-items: center;
      padding: 8px 0;

      > .link .typography {
        color: white;
      }
    }

    .copyright-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .copyright-text {
        color: #a7a7a7;
      }

      .scroll-up-button {
        border: 2px solid white;
        box-sizing: border-box;
      }
    }
  }
`;
