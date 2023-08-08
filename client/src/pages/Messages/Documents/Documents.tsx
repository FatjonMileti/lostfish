import { styled } from '@mui/system';
import classNames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { Icon } from '../../../components/Icon';
import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Modal } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Tab, Tabs } from '../../../components/Tab';

export const Documents = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [showModal, setShowModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={classNames('documents', className)}>
      <div className='documents-header'>
        <Icon icon='folder' />
        <Typography className='title'>Documents</Typography>
      </div>

      <Typography variant='body5' className='documents-description'>
        In order to complete the transaction, you will need to provide us with some documents. Once you have
        all the documents uploaded you can complete the transaction.
      </Typography>

      <div className='action-buttons'>
        <Label
          variant='secondary'
          // onClick={() => setShowModal(true)}
        >
          View documents
        </Label>
        <Label disabled>Complete transaction</Label>
      </div>
      <Modal open={showModal} className='view-documents-modal' onBackdropClick={() => setShowModal(false)}>
        <div className='modal-header'>
          <div></div>
          <div className='tabs-wrapper'>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tab label='Tenant documents' />
              <Tab label='Signed documents' />
              <Tab label='Lostfish T&Cs' />
            </Tabs>
          </div>
          <IconButton onClick={() => setShowModal(false)}>
            <Icon icon='close' />
          </IconButton>
        </div>
        <div className='modal-body'>
          <Typography variant='body3'>Tenant documents</Typography>
          <div></div>
          <Typography variant='body5'>
            You can find more information about why we need these documents in the Lostfish T&Cs section.
          </Typography>
        </div>
      </Modal>
    </div>
  );
})`
  &.documents {
    border-radius: 12px;
    background: #f7f1e7;
    align-self: flex-start;
    padding: 24px;

    .documents-header {
      display: flex;
      column-gap: 8px;
      .title {
        font-family: Roobert, serif;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
      }
    }

    .documents-description {
      margin-top: 16px;
    }

    .action-buttons {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;

      .button,
      .label {
        width: auto;
      }
    }

    .view-documents-modal {
      box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.04);
      .modal-container {
        width: 1020px;
        max-width: 100vw;
        height: 730px;
        max-height: 100vh;
        padding: 0;
      }

      .modal-header {
        display: grid;
        grid-template-columns: min-content auto min-content;
        justify-content: space-between;
        padding: 20px 36px;

        align-items: center;
      }

      .modal-body {
        padding: 16px 32px;
        display: grid;
        row-gap: 24px;
      }
    }
  }
`;
