import React, { useState } from 'react';
import { styled } from '@mui/system';
import classNames from 'classnames';
import { Icon } from '../../../components/Icon';
import { Typography } from '../../../components/Typography';
import { Label } from '../../../components/Label';
import { Modal } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Tab, Tabs } from '../../../components/Tab';
import { IRoom } from '../messages.interface';
import { TenantDocuments } from './TenantDocuments';
import { SignedDocuments } from './SignedDocuments';
import { LostfishTermsAndCondition } from './LostfishTermsAndCondition';
import Can from '../../../components/Can';
import { useUserStore } from '../../../globalState/user';
import { NewRentingContract } from './NewRentingContract';
import { CASLAction } from '../../../utils/ability.util';

interface IDocumentTest extends React.HTMLAttributes<HTMLDivElement> {
  room: IRoom;
  documentState: {
    areDocumentsApproved: boolean;
    isContractCreated: boolean;
  };
  onReload: () => void;
}

export const DocumentsTest = styled(({ room, documentState, className, onReload }: IDocumentTest) => {
  const [showModal, setShowModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const { userDetails } = useUserStore();

  const onFinish = () => {
    alert('Contract created with success!');
    onReload();
  };

  const onModalClose = () => {
    setShowModal(false);
    onReload();
  };

  const tenant = room.participant._id === userDetails.user_id ? room.author : room.participant;

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
        <Label variant='secondary' onClick={() => setShowModal(true)}>
          View documents
        </Label>

        <Can do={CASLAction.Create} on='SignGenerator'>
          {!documentState.isContractCreated && (
            <NewRentingContract tenant={tenant._id} property={room.property} onFinish={onFinish} />
          )}
        </Can>

        {documentState.isContractCreated && (
          <Label variant='tertiary' disabled={!documentState.areDocumentsApproved}>
            Contract is ready to sign
          </Label>
        )}
      </div>
      <Modal open={showModal} className='view-documents-modal' onBackdropClick={() => onModalClose()}>
        <div className='modal-header'>
          <div></div>
          <div className='tabs-wrapper'>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tab label='Tenant documents' />
              <Tab label='Signed documents' />
              <Tab label='Lostfish T&Cs' />
            </Tabs>
          </div>
          <IconButton onClick={() => onModalClose()}>
            <Icon icon='close' />
          </IconButton>
        </div>
        {activeTab === 0 && <TenantDocuments room={room} />}
        {activeTab === 1 && <SignedDocuments room={room} />}
        {activeTab === 2 && <LostfishTermsAndCondition />}

        {[0, 1].includes(activeTab) && (
          <div className='document-footer'>
            <Typography variant='body4'>
              You can find more information about why we need these documents in the Lostfish T&Cs section.
            </Typography>
          </div>
        )}
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

        .modal-item {
          display: flex;
          padding: 24px;
          align-items: center;
          gap: 16px;
          align-self: stretch;

          border-radius: 8px;
          border: 1px solid var(--primary-brand-ocean-blue, #184d6d);
        }
      }

      .document-footer {
        padding: 16px 32px;
      }
    }
  }
`;
