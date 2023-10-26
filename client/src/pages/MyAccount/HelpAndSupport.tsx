import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import {Checkbox} from "../../components/Checkbox";

export const HelpAndSupport = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`help-and-support ${className}`}>
      <Typography variant='body5'>For any inquiries use the contact details below</Typography>
      <div className='body-content'>
        <div className='section'>
          <Typography className='title' variant='body4'>
            This is a chapter heading.
          </Typography>
          <div className='customer-support'>
            <Button variant='secondary' startIcon={<Icon icon='email' size={20} />}>
              Send email
            </Button>
            <Button startIcon={<Icon icon='phone' size={20} />}>Call support</Button>
          </div>
        </div>

        <div className='section'>
          <Typography className='title' variant='body4'>
            Working hours
          </Typography>
          <div className='working-hours'>
            <Typography variant='body4'>Monday-Tuesday: 09:00 - 18:00</Typography>
            <Typography variant='body4'>Saturday: 09:00 - 14:00</Typography>
            <Typography variant='body4'>
              Sunday: <b>Closed</b>
            </Typography>
          </div>
        </div>

        <div className='section'>
          <Typography className='title' variant='body4'>
            Address
          </Typography>
          <div className='working-hours'>
            <Typography variant='body4'>
              Street: 34 Oxford Rd
              <br />
              City: Wormley
              <br />
              Phone number: 078 1161 6319
              <br />
              Zip code: EN10 4WL
              <br />
              Country: United Kingdom
            </Typography>
          </div>
        </div>
        <div className="assistance">
          <Checkbox /> <Typography variant='body4'>Organise assistance with viewing the property ?</Typography>
        </div>

      </div>
    </div>
  );
})`
  &.help-and-support {
    display: grid;
    row-gap: 24px;
    .body-content {
      display: grid;
      row-gap: 32px;
      .section {
        display: grid;
        row-gap: 16px;
        .title {
          font-weight: 700;
        }
        .customer-support {
          display: flex;
          column-gap: 16px;
        }

        .working-hours {
          display: grid;
          row-gap: 16px;
        }
      }
      .assistance {
        display: flex;
        gap: 8px;
      }
    }
  }
`;
