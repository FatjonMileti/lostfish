import React from 'react';
import { styled } from '@mui/system';
import classNames from 'classnames';
import { Header } from './Header';
import homeBackground from './home-background.png';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { getAvatarFormIndex } from '../HomeLoggedIn/avatars';
import { LoginModal } from '../Login/LoginModal';
import { CreateAccountModal } from '../CreateAccount/CreateAccountmodal';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [showLoginModal, setShowLoginModal] = React.useState(true);
  const [showCreateAccountModal, setShowCreateAccountModal] = React.useState(false);
  const navigate = useNavigate();

  const onSigInClick = () => {
    setShowCreateAccountModal(false);
    setShowLoginModal(true);
  };

  const onCreateAccountClick = () => {
    setShowLoginModal(false);
    setShowCreateAccountModal(true);
  };
  return (
    <>
      <LoginModal
        open={showLoginModal}
        onBackdropClick={() => setShowLoginModal(false)}
        onCreateAccountClick={onCreateAccountClick}
      />
      <CreateAccountModal
        open={showCreateAccountModal}
        onBackdropClick={() => setShowCreateAccountModal(false)}
        onSigInClick={onSigInClick}
      />

      <div className={classNames('home-page', className)}>
        <Header onSigInClick={onSigInClick} />
        <div className='container'>
          <Typography variant='h2'>Looking for your next home?</Typography>
          <Typography variant='body4' className='description'>
            Our goal is to revolutionise the property industry by using technology and data to empower and
            inform customers in the buying, selling, and renting process.
          </Typography>

          <div className='potential-matches-list'>
            <Avatar image={getAvatarFormIndex('0')} />
            <Avatar image={getAvatarFormIndex('1')} />
            <Avatar image={getAvatarFormIndex('2')} />
            <Avatar image={getAvatarFormIndex('3')} />
            <Avatar image={getAvatarFormIndex('4')} />
            <Avatar image={getAvatarFormIndex('5')} />
          </div>

          <Button size='large' onClick={onCreateAccountClick} className='create-account-button'>
            Join our community
          </Button>
        </div>
      </div>
    </>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    z-index: 1;

    justify-items: center;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(${homeBackground}), lightgray 50% / cover no-repeat;
      opacity: 0.05;

      background-size: cover;
      background-position-y: center;
      z-index: -1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: linear-gradient(148deg, #fffbf3 18.95%, #fff 100%), #fff;

      background-position-y: top;
      background-size: cover;
      z-index: -2;
    }

    .header {
      position: absolute;
    }

    .container {
      display: grid;
      justify-items: center;
      align-content: center;
      width: 672px;
      max-width: 100vw;
      align-self: center;

      .description {
        margin-top: 16px;
      }

      .potential-matches-list {
        margin-top: 32px;
        display: flex;
        .avatar {
          height: 80px;
          width: 80px;
          margin-left: -12px;
          z-index: 1;
          &:first-of-type {
            margin-left: 0;
          }
        }
      }

      .create-account-button {
        margin-top: 48px;
      }
    }
  }
`;
