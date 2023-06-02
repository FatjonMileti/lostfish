import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

export const TransactionAgreement = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`transaction-agreement ${className}`}>
      <div className='body-content'>
        <div className='section'>
          <Typography variant='body4' className='title'>
            ID Verification
          </Typography>
          <Typography variant='body4'>
            Upload a document (jpg, png or pdf) of your valid ID to verify your account. Once verified a badge
            will be visible on your account to indicate that your account is verified.
          </Typography>

          <Button size='small' variant='secondary' startIcon={<Icon icon='plus' size={16} />}>
            Add document
          </Button>
          <div className='note'>
            <Typography variant='body5'>
              <b>Note:</b> ID verification is mandatory to generate the transaction agreement. You can skip
              this step but remember you won’t be able to message your match and close the deal until you
              generate and sign the transaction agreement.
            </Typography>
          </div>
        </div>

        <div className='section'>
          <Typography variant='body4' className='title'>
            Lostfish transaction agreement
          </Typography>
          <Typography variant='body4'>
            The transaction agreement acts as a guarantee between you, your match and Lostfish that everything
            will be handled according with the UK in force laws.
          </Typography>

          <Button disabled size='small' variant='secondary'>
            Generate agreement
          </Button>
          <div className='note'>
            <Typography variant='body5'>
              <b>Note:</b> The agreement can be generated after you have your ID verified. You can skip this
              step but remember you won’t be able to message your match and close the deal until you generate
              and sign the transaction agreement.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
})`
  &.transaction-agreement {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    .body-content {
      display: grid;
      row-gap: 32px;
      .section {
        display: grid;
        row-gap: 16px;

        .title {
          color: #a7a7a7;
        }
        .note {
          padding: 12px;
          color: #646464;
          background-color: #f3f4f5;
          border-radius: 8px;
        }
      }
    }
  }
`;
