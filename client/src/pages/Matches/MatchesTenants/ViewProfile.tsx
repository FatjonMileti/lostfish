import { styled } from '@mui/system';
import { Modal } from '../../../components/Modal';
import { Typography } from '../../../components/Typography';
import React, { HTMLAttributes } from 'react';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';

import verified from '../../MyAccount/images/verified.svg';
import { getAvatarFormIndex } from '../../HomeLoggedIn/avatars';
interface ViewProfileProps extends HTMLAttributes<HTMLDivElement> {
  closeViewProfile: () => void;
  criteria: any;
}
export const ViewProfile = styled(({ className, closeViewProfile, criteria }: ViewProfileProps) => {
  const {
    propertyType,
    propertyPreferences,
    areaOfInterest,
    radius,
    moveIn,
    budget,
    nrOfBedrooms,
    nrOfBathrooms,
    specificPropertyFeatures,
    depositAmount,
    firstName,
    lastName,
    avatar
  } = criteria;

  return (
    <Modal className={`view-profile-modal ${className}`} open={true} onBackdropClick={closeViewProfile}>
      <IconButton size='large' className='close-button' onClick={closeViewProfile}>
        <Icon icon='close' size={16} />
      </IconButton>

      <div className='details-side'>
        <div className='header'>
          <div className='header-left'>
            <Typography variant='body3' className='tenant-name'>
              {`${firstName} ${lastName}`}
            </Typography>

            <img src={verified} alt='Verified indicator' />
          </div>

          <Typography variant='body3' className='match-rate'>
            34% Match rate
          </Typography>
        </div>
        <div className='sections'>
          <div className='section'>
            <Typography variant='body4' className='section-title'>
              About
            </Typography>
            <Typography variant='body5'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.{' '}
            </Typography>
          </div>
          <div className='section looking-for-section'>
            <Typography variant='body4' className='section-title'>
              Looking for
            </Typography>
            <div className='looking-for-content'>
              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Property type
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {propertyType}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  budget
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {budget}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Property class
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {propertyPreferences}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Deposit
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {depositAmount}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Location
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {areaOfInterest}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Bedrooms
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {nrOfBedrooms}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Radius
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {radius}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Bathrooms
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {nrOfBathrooms}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Move in
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {moveIn}
                </Typography>
              </div>

              <div className='detail'>
                <Typography variant='body5' className='detail-name'>
                  Parking needed
                </Typography>
                <Typography variant='body5' className='detail-value'>
                  {specificPropertyFeatures.includes('Parking spot') ? 'Yes' : 'No'}
                </Typography>
              </div>
            </div>
          </div>
          <div className='section social-networks-sections'>
            <Typography variant='body4' className='section-title'>
              Social media accounts
            </Typography>
            <div className='social-networks-content'>
              <Icon icon='twitter' size={16} />
              <Icon icon='instagram' size={16} />
            </div>
          </div>
        </div>
      </div>
      <div className='avatar-side' style={{ backgroundImage: `url(${getAvatarFormIndex(avatar)})` }}></div>
    </Modal>
  );
})`
  &.view-profile-modal {
    position: relative;
    width: 1020px;
    overflow: hidden;
    overflow-y: auto;
    max-height: 100vh;
    max-width: 100vw;
    .modal-container {
      padding: 0 !important;
      display: grid;
      grid-template-columns: 1.32fr 1fr;

      .close-button {
        position: absolute;
        right: 23px;
        top: 32px;
      }

      .details-side {
        padding: 32px 56px 32px 32px;
        .header {
          display: flex;
          justify-content: space-between;
          .header-left {
            display: flex;
            column-gap: 8px;
            align-items: center;
            .tenant-name {
              font-family: At Gambit, serif;
            }
            img {
              width: 27px;
              height: 27px;
              padding: 7px;
            }
          }

          .match-rate {
            color: #c4b1a3;
            font-family: Roobert, serif;
            font-weight: 700;
          }
        }

        .sections {
          display: grid;
          row-gap: 40px;
          margin-top: 32px;
          .section {
            display: grid;
            row-gap: 16px;

            .section-title {
              color: #a7a7a7;
            }

            &.looking-for-section {
              .looking-for-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 64px;
                row-gap: 8px;

                .detail {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  column-gap: 16px;

                  .detail-value {
                    font-weight: 700;
                    text-align: end;
                  }
                }
              }
            }

            &.social-networks-sections {
              .social-networks-content {
                display: flex;
                column-gap: 16px;

                .icon {
                  color: #184d6d;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }

      .avatar-side {
        padding: 32px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        border-radius: 0 16px 16px 0;
      }
    }
  }
`;
