import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import React from 'react';

interface IPropertyProps {
  match: any;
  setPropertyToView: (property: any) => void;
}
export const PropertyView = (props: IPropertyProps) => {
  const { match, setPropertyToView } = props;

  return (
    <div className='starred-property'>
      <img
        className='property-background-image'
        alt='property-image'
        src={match.property.property_images[0].link}
        width='100%'
      />
      <div className='property-footer'>
        <Typography className='property-title' variant='body4'>
          {match.property.title || 'Two bed flat with terrace'}
        </Typography>
        <div className='details'>
          <div className='match-percentage'>
            <Typography variant='body5'>{match.property.percentage}%</Typography>
          </div>
          <Button
            size='small'
            variant='secondary'
            inverted
            className='details-button'
            onClick={() => setPropertyToView(match)}>
            Property details
          </Button>
        </div>
      </div>
    </div>
  );
};
