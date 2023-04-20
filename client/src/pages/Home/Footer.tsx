import styled from '@emotion/styled';
import React from 'react';
import { Typography } from '../../components/Typography';
import { Link } from '../../components/Link';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { TextField } from '../../components/TextField';

import LogoPlusTextWhite from '../../assets/images/LogoPlusTextWhite.svg';

export const Footer = styled(({ className = '' }) => {
  return (
    <div className={`footer-section ${className}`}>
      <div className='columns-layout'>
        <div className='column-1'>
          <img className='logo' alt='logo' src={LogoPlusTextWhite} />
          <Typography variant='body4' className='column-title'>
            Our aim is to revolutionise the property industry by utilising technology and data to empower and
            inform customers in the buying, selling, and renting process.
          </Typography>
          <div className='social-networks'>
            <IconButton size='large'>
              <Icon icon='facebook-f' color='white' size={16} />
            </IconButton>
            <IconButton size='large'>
              <Icon icon='twitter' color='white' size={16} />
            </IconButton>
            <IconButton size='large'>
              <Icon icon='instagram' color='white' size={16} />
            </IconButton>
            <IconButton size='large'>
              <Icon icon='linkedin-in' color='white' size={16} />
            </IconButton>
          </div>
        </div>
        <div className='column-2'>
          <Typography variant='menu' className='column-title'>
            TAKE ACTION
          </Typography>
          <Link>RENT</Link>
          <Link>BUY</Link>
          <Link>SELL</Link>
        </div>
        <div className='column-3'>
          <Typography variant='menu' className='column-title'>
            Useful links
          </Typography>
          <Link variant='body4'>About Lostfish</Link>
          <Link variant='body4'>How Lostfish works</Link>
          <Link variant='body4'>What defines us</Link>
          <Link variant='body4'>Terms & Conditions</Link>
          <Link variant='body4'>Privacy Policy</Link>
        </div>
        <div className='column-4'>
          <Typography variant='menu' className='column-title'>
            stay updated
          </Typography>
          <Typography variant='body4' className='keep-in-touch-text'>
            Keep in touch with our latest news by subscribing to our newsletter.
          </Typography>
          <TextField placeholder='Enter your email address' className='email-address' />
          <Button className='subscribe-button' variant='outlined'>
            Subscribe
          </Button>
        </div>
      </div>
      <div className='copyright-bar'>
        <Typography className='copyright-text' variant='body5'>
          2023 © LOSTFISH LIMITED. ALL RIGHTS RESERVED
        </Typography>
        <IconButton size='small' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Icon icon='arrow-up' color='white' />
        </IconButton>
      </div>
    </div>
  );
})`
  &.footer-section {
    margin-top: 88px;
    padding-top: 80px;
    padding-inline: 36px;
    background-color: #0d2a38;

    .columns-layout {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      column-gap: 24px;

      .column-1 {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 24px;

        img.logo {
          height: 55px;
        }

        .typography {
          color: white;
        }

        .social-networks {
          display: flex;
          align-items: center;
          column-gap: 16px;
        }
      }

      .column-2 {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
        .column-title {
          color: #c0daff;
          letter-spacing: 0.08em;
        }

        .link {
          .typography {
            color: white;
          }
        }
      }

      .column-3 {
        display: flex;
        flex-direction: column;
        row-gap: 24px;
        .column-title {
          color: #c0daff;
          letter-spacing: 0.08em;
        }

        .link {
          .typography {
            color: white;
          }
        }
      }

      .column-4 {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        //row-gap: 24px;

        padding-inline: 58px;

        .typography {
          color: white;

          &.column-title {
            color: #c0daff;
            letter-spacing: 0.08em;
          }
        }

        .keep-in-touch-text {
          margin-top: 16px;
        }

        .email-address {
          margin-top: 16px;
          width: 100%;
        }

        .subscribe-button {
          color: white;
          border-color: white;
          text-transform: none;
        }
      }
    }

    .copyright-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      padding-bottom: 36px;

      .copyright-text {
        color: #a7a7a7;
      }

      .icon-button {
        border: none;
      }
    }
  }
`;
