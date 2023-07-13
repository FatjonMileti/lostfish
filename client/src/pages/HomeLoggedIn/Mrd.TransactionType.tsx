import { styled } from '@mui/system';
import { Typography } from '../../components/Typography';
import { motion } from 'framer-motion';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import { Radio } from '../../components/Radio';
import React, { HTMLAttributes } from 'react';

export interface TransactionTypeProps extends HTMLAttributes<HTMLDivElement> {
  onTransactionTypeChange: (transactionType: string) => void;
  transactionType?: string;
}
export const TransactionType = styled(
  ({ className, transactionType, onTransactionTypeChange }: TransactionTypeProps) => {
    return (
      <div className={`${className} transaction-type`}>
        <Typography variant='body2'>What kind of transaction are you looking for?</Typography>
        <div className='looking-for-container'>
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1 }}
              className={`looking-for-choice for-tenant ${transactionType === 'Tenant' ? 'active' : ''}`}
              onClick={() => onTransactionTypeChange('Tenant')}>
              <div className='indicators'>
                <IconButton size='large'>
                  <Icon icon='key' size={26} />
                </IconButton>

                <Typography variant='body4' className='title'>
                  I’m looking to rent a place
                </Typography>
                <Radio value='Rent' checked={transactionType === 'Tenant'} readOnly />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1 }}
              className={`looking-for-choice for-buyer ${transactionType === 'Buyer' ? 'active' : ''}`}
              onClick={() => onTransactionTypeChange('Buyer')}>
              <div className='indicators'>
                <IconButton size='large' noBackground>
                  <Icon icon='credit-card' />
                </IconButton>
                <Typography variant='body4' className='title'>
                  I’m looking to buy a place
                </Typography>
                <Radio value='Sale' checked={transactionType === 'Buyer'} readOnly />
              </div>
            </motion.div>
          </>
        </div>
      </div>
    );
  }
)`
  &.transaction-type {
    display: grid;
    justify-items: center;

    .looking-for-container {
      margin-top: 32px;
      display: flex;
      gap: 24px;

      .looking-for-choice {
        border-radius: 16px;
        border: 2px solid #f3f4f5;
        box-sizing: border-box;
        padding: 24px;
        user-select: none;
        cursor: pointer;
        width: 440px;

        &.active {
          border: 2px solid #eee0d3;
          background: #eee0d3;
          .icon-button {
            background-color: white;
            color: #0d2a38;
          }

          .title {
            color: black;
          }

          .radio {
            border-color: #0d2a38;
            &:after {
              background-color: #0d2a38;
            }
          }
        }

        .indicators {
          display: flex;
          justify-content: space-between;
          column-gap: 16px;
          align-items: center;
        }

        .icon-button {
          background-color: #f3f4f5;
          color: black;
        }

        .title {
          font-weight: 700;
          font-size: 18px;
          color: #646464;
        }

        .radio {
          border-color: #a7a7a7;
        }
      }
    }
  }
`;
