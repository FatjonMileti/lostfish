import { styled } from '@mui/system';
import { Header } from '../HomeLoggedIn/Header';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

export const Properties = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`properties-page ${className}`}>
      <Header />
      <div className='no-properties'>
        <Typography variant='body2'>You currently have no properties in your portfolio</Typography>
        <Button size='large' className='add-property-button' startIcon={<Icon icon='plus' size={16} />}>
          Add Property
        </Button>
      </div>
    </div>
  );
})`
  &.properties-page {
    background: linear-gradient(141.18deg, #cdf0ea 10.08%, #f9f9f9 98.58%);
    height: 100vh;

    display: grid;
    grid-template-rows: min-content auto;

    .no-properties {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .add-property-button {
        margin-top: 32px;
      }
    }
  }
`;
