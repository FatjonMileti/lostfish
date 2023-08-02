import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import React from 'react';

interface IProperty {
  property_images: any[];
  room_details: string;
  _id: string;
  status_string: object;
}
interface IPropertyProps {
  property: IProperty;
}
export const PropertyView = (props: IPropertyProps) => {
  const { property } = props;

  return (
    <div className='starred-property'>
      <img
        className='property-background-image'
        alt='property-image'
        src={property.property_images[0].link}
        width='100%'
      />
      <div className='property-footer'>
        <Typography className='property-title' variant='body4'>
          Two bed flat with terrace
        </Typography>
        <div className='details'>
          <div className='match-percentage'>
            <Typography variant='body5'>100%</Typography>
          </div>
          <Button size='small' variant='secondary' inverted className='details-button'>
            Property details
          </Button>
        </div>
      </div>
    </div>
  );
};
