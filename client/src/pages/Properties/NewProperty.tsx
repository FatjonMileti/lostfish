import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

export const NewProperty = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`new-property ${className}`}>
      <Button
        size='large'
        className='add-property-button'
        startIcon={<Icon icon='plus' size={16} />}
        // onClick={() => navigate('/properties/new-property')}
      >
        Add Property
      </Button>
    </div>
  );
})`
  &.new-property {
  }
`;
