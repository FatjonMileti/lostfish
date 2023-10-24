import { styled } from '@mui/system';

import { Modal, ModalProps } from '../../components/Modal';
import { Typography } from '../../components/Typography';
import { IconButton } from '../../components/IconButton';
import { Icon } from '../../components/Icon';
import React from 'react';
import { Label } from '../../components/Label';
import { useProfileStore } from '../../globalState/profile';
import { useNavigate } from 'react-router-dom';
import { SetCriteriaDrawer } from '../SetCriteria/SetCriteriaDrawer';
import { CloseButton } from '../../components/CloseButton';

interface ImproveTrustScoreModalProps extends ModalProps {
  afterRefineSearch?: () => void;
}

export const ImproveTrustScoreModal = styled(
  ({ closeModal = () => {}, afterRefineSearch = () => {}, ...rest }: ImproveTrustScoreModalProps) => {
    const profileStore = useProfileStore();
    const navigate = useNavigate();
    const [criteriaModalVisibility, setCriteriaModalVisibility] = React.useState(false);

    return (
      <>
        {profileStore.role === 'Tenant' && (
          <SetCriteriaDrawer
            open={criteriaModalVisibility}
            setOpen={setCriteriaModalVisibility}
            afterRefineSearch={() => {
              afterRefineSearch();
            }}
          />
        )}

        <Modal {...rest} onBackdropClick={closeModal}>
          <div className='modal-header'>
            <div className='left-texts'>
              <Typography variant='body2'>Improve match score</Typography>
              <Typography variant='body2'>•</Typography>
              <Typography variant='body2' className='percentage'>
                {profileStore.trust_score}%
              </Typography>
            </div>
            <CloseButton onClick={closeModal} />
          </div>

          <div className='modal-body'>
            <div className='card'>
              <Typography variant='body4' className='card-title'>
                Add a description about yourself • <span className='percentage'>25%</span>
              </Typography>

              <Typography variant='body4' className='card-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore.
              </Typography>

              {!profileStore.description ? (
                <Label
                  variant='tertiary'
                  size='medium'
                  className='improve-link'
                  onClick={() => navigate('/my-account/account-settings')}>
                  Add a description
                  <Icon icon='arrow-right-1' size={16} />
                </Label>
              ) : (
                <div className='completed'>
                  <div className='completed-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4'>Completed</Typography>
                </div>
              )}
            </div>

            {profileStore.role === 'Tenant' && (
              <>
                <div className='card'>
                  <Typography variant='body4' className='card-title'>
                    Add more details to your search • <span className='percentage'>30%</span>
                  </Typography>

                  <Typography variant='body4' className='card-description'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore.
                  </Typography>

                  <Label
                    variant='tertiary'
                    size='medium'
                    className='improve-link'
                    onClick={() => {
                      closeModal();
                      setCriteriaModalVisibility(true);
                    }}>
                    Refine search
                    <Icon icon='arrow-right-1' size={16} />
                  </Label>
                </div>
              </>
            )}

            <div className='card'>
              <Typography variant='body4' className='card-title'>
                Solicitors
              </Typography>

              <Typography variant='body4' className='card-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore.
              </Typography>

              {!profileStore.description ? (
                <Label
                  variant='tertiary'
                  size='medium'
                  className='improve-link'
                  onClick={() => navigate('/my-account/solicitors')}>
                  Solicitors
                  <Icon icon='arrow-right-1' size={16} />
                </Label>
              ) : (
                <div className='completed'>
                  <div className='completed-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4'>Completed</Typography>
                </div>
              )}
            </div>

            <div className='card'>
              <Typography variant='body4' className='card-title'>
                Select avatar • <span className='percentage'> 5%</span>
              </Typography>

              <Typography variant='body4' className='card-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore.
              </Typography>

              {!profileStore.avatar ? (
                <Label
                  variant='tertiary'
                  size='medium'
                  className='improve-link'
                  onClick={() => navigate('/my-account/account-settings')}>
                  Select avatar
                  <Icon icon='arrow-right-1' size={16} />
                </Label>
              ) : (
                <div className='completed'>
                  <div className='completed-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4'>Completed</Typography>
                </div>
              )}
            </div>

            <div className='card'>
              <Typography variant='body4' className='card-title'>
                Get your account verified • <span className='percentage'> 40%</span>
              </Typography>

              <Typography variant='body4' className='card-description'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore.
              </Typography>
              {!profileStore.documents.find((doc) => doc.type === 'Proof of ID') ? (
                <Label
                  variant='tertiary'
                  size='medium'
                  className='improve-link'
                  onClick={() => navigate('/my-account/transaction-agreement')}>
                  Verify
                  <Icon icon='arrow-right-1' size={16} />
                </Label>
              ) : (
                <div className='completed'>
                  <div className='completed-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4'>Completed</Typography>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </>
    );
  }
)`
  & {
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw !important;
    width: 1020px;
    .modal-container {
      padding: 0 !important;
      .modal-header {
        display: flex;
        padding: 32px;
        box-sizing: border-box;
        justify-content: space-between;

        .left-texts {
          display: flex;
          column-gap: 16px;

          .percentage {
            color: #e5155a;
            font-family: Roobert, serif;
            font-weight: 700;
          }
        }
      }

      .modal-body {
        padding: 0 24px 32px 24px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 16px;

        .percentage {
          color: #e5155a;
        }
        .card {
          display: grid;
          border-radius: 12px;
          padding: 24px;
          row-gap: 16px;
          box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);

          .card-title {
            font-size: 18px;
            font-weight: 700;
          }

          .card-description {
          }

          .completed {
            display: flex;
            column-gap: 8px;
            align-items: center;

            .completed-indicator {
              height: 32px;
              width: 32px;
              background-color: #184d6d;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .typography {
              font-weight: 600;
              color: #184d6d;
            }
          }
        }
      }
    }
  }
`;
