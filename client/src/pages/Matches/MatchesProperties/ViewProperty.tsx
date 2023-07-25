import { styled } from '@mui/system';
import { Typography } from '../../../components/Typography';

import { Modal, ModalProps } from '../../../components/Modal';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import React from 'react';
import { Label } from '../../../components/Label';
import { useProfileStore } from '../../../globalState/profile';
import { useNavigate } from 'react-router-dom';
import { useCriteriaStore } from '../../../globalState/criteria';
import apartament from '../images/gallery-4.png';
import apartament1 from '../images/gallery-1.png';
import apartament2 from '../images/gallery-2.png';
import apartament3 from '../images/gallery-3.png';
import apartament5 from '../images/gallery-5.png';
import { Avatar } from '../../../components/Avatar';
import { avatars } from '../../HomeLoggedIn/avatars';
import { ArrowButton } from '../../../components/ArrowButton';

interface ViewPropertyModalProps extends ModalProps {
  refineYourSearchClick?: () => void;
}

export const ViewProperty = styled(
  ({ closeModal, refineYourSearchClick = () => {}, ...rest }: ViewPropertyModalProps) => {
    const profileStore = useProfileStore();
    // console.log('aaaa', profileStore);

    return (
      <Modal {...rest}>
        <div className='img'>
          <div className='content'>
            <div className='header'>
              <div className='avatar-wrapper'>
                <Avatar
                  image={profileStore.avatar ? avatars[parseInt(profileStore.avatar)]?.image : undefined}
                />
                <Typography variant='body4'>Nancy Jones</Typography>
                <Typography variant='body4' className='dot'>
                  •
                </Typography>
                <Typography variant='body4'>34%</Typography>
              </div>
              <IconButton size='large'>
                <Icon icon='close' size={12} onClick={closeModal} />
              </IconButton>
            </div>
            <div className='footer'>
              <ArrowButton direction='left' hero />
              <div className='images'>
                <img src={apartament} />
                <img src={apartament1} />
                <img src={apartament2} />
                <img src={apartament3} />
                <img src={apartament5} />
                <img src={apartament} />
                <img src={apartament} />
              </div>
              <ArrowButton direction='right' hero />
            </div>
          </div>
        </div>
        <div className='description'>
          <div className='description-header'>
            <div className='title'>
              <Typography variant='body2'>Two bedroom apartment for rent</Typography>
              <IconButton size='large'>
                <Icon icon='star' size={12} />
              </IconButton>
            </div>
            <div className='property-details'>
              <div className='detail'>
                <Icon icon='location' />
                <Typography variant='body5'>Bristol, UK</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='banknote' />
                <Typography variant='body5'>£1,150 PCM</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='double-bed' />
                <Typography variant='body5'>2</Typography>
              </div>
              <Typography variant='body4' className='dot'>
                •
              </Typography>
              <div className='detail'>
                <Icon icon='bathtub' />
                <Typography variant='body5'>1</Typography>
              </div>
            </div>
          </div>
          <div className='section'>
            <Typography variant='body4' className='label'>
              Description
            </Typography>
            <Typography variant='body4' className='section-description'>
              One bed room large FF Flat available to rent, situated 7 minutes walk to Hainault tube station,
              the property is fully furnished. Having a separate large reception, the property comes with one
              allocated parking.
            </Typography>
          </div>
          <div className='section'>
            <Typography variant='body4' className='label'>
              Location details
            </Typography>
            <Typography variant='body4' className='section-description'>
              Sitting midway between Battersea Park and Clapham Junction, The Set offers an enviable variety
              of entertainment, dining, drinking and shopping opportunities alongside excellent schools and
              first rate transport connections.Battersea is an intimate residential area, with great
              restaurants and bars, all close by. Just down the road is Battersea Square. Its unique setting
              and continental style dining add a laid-back, village feel to this very special area of London.
              Battersea itself is a veritable cultural haven, home to the Pump House Gallery and the Battersea
              Arts Centre, a celebrated fringe venue.
            </Typography>
          </div>
        </div>
      </Modal>
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
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;

      .img {
        border-radius: 12px;
        background-image: url(${apartament});
        background-repeat: no-repeat;
        background-size: cover;
        width: 1020px;
        height: 574px;
        box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 0.04);

        display: grid;

        .content {
          display: flex;
          height: 574px;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;

          .header {
            display: flex;
            width: 1020px;
            padding: 32px;
            justify-content: space-between;
            align-items: flex-start;
            box-sizing: border-box;

            .avatar-wrapper {
              display: flex;
              align-items: center;
              gap: 8px;
              border-radius: 244px;

              .typography {
                color: #fff;
                font-size: 18px;
                font-weight: 700;
              }

              .dot {
                color: #cfd5d5;
              }
            }
          }
          .footer {
            display: flex;
            padding: 32px;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;

            .icon {
              color: #fff;
            }
            .images {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 8px;

              img {
                width: 92px;
                height: 61px;
                border-radius: 4px;
                opacity: 0.7;
              }
            }
          }
        }
      }
      .description {
        display: flex;
        padding: 32px;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 24px;
        align-self: stretch;

        .description-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;

          .title {
            display: flex;
            align-items: center;
            gap: 24px;
            align-self: stretch;

            .typography {
              flex: 1 0 0;
              font-weight: 400;
              line-height: 40px;
            }
          }

          .property-details {
            color: #000;
            font-weight: 700;
            display: flex;
            column-gap: 8px;
            align-items: center;

            .detail {
              display: flex;
              column-gap: 4px;
              align-items: center;
            }

            .dot {
              color: #a7a7a7;
            }
          }
        }

        .section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .label {
            color: #0d2a38;
            font-weight: 700;
          }

          .section-description {
            align-self: stretch;
            font-weight: 400;
          }
        }
      }
    }
  }
`;
