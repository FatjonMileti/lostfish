import { HTMLAttributes, useState } from 'react';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

import { Typography } from '../../components';
import { Icon } from '../../components';
import { IconButton } from '../../components';

interface FaqComponentProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  descriptionForTenants: string;
  descriptionForLandlords: string;
}
export const FaqComponent = styled(
  ({ className, title, descriptionForTenants, descriptionForLandlords }: FaqComponentProps) => {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const toggleDescription = () => {
      setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (
      <div className={`faq-component ${className}`}>
        <div className='title-and-button-wrapper'>
          <Typography variant='body3' className='title'>
            {title}
          </Typography>
          <IconButton size='small' onClick={toggleDescription}>
            <Icon icon={isDescriptionVisible ? 'chevron-up' : 'chevron-down'} size={24} />
          </IconButton>
        </div>
        <motion.div
          initial={false}
          animate={{ height: isDescriptionVisible ? 'auto' : 0 }}
          className='descriptions'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDescriptionVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className='descriptions'>
            <Typography variant='body4' className='text'>
              <span className='for-user-type'>For Tenants: </span>
              {descriptionForTenants}
            </Typography>
            <Typography variant='body4' className='text'>
              <span className='for-user-type'>For Landlords: </span> {descriptionForLandlords}
            </Typography>
          </motion.div>
        </motion.div>
      </div>
    );
  }
)`
  &.faq-component {
    display: grid;
    align-items: center;
    padding: 16px 0px;
    border-bottom: 1px solid #e7e7e7;

    .title-and-button-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;

      .title {
        font-weight: 900;
        line-height: 32px;
      }

      .icon-button {
        padding: 0px;
      }
    }

    .descriptions {
      display: grid;
      row-gap: 16px;
      max-width: 904px;
      overflow: hidden;

      .text {
        line-height: 24px;
        font-weight: 500;
        align-self: stretch;

        .for-user-type {
          font-weight: 700;
        }
      }
    }
  }
`;
