import React from 'react';
import { styled } from '@mui/system';
import classNames from 'classnames';

import { Header } from './Header';
import { LoginModal } from '../Login/LoginModal';
import { CreateAccountModal } from '../CreateAccount/CreateAccountmodal';
import { ForgotPasswordModal } from '../ForgotPassword/ForgotPasswordModal';
import { ResetPasswordModal } from '../ResetPassword/ResetPasswordModal';
import { SectionOne } from '../About/About.SectionOne';
import { SectionTwo } from '../About/About.SectionTwo';
import { SectionFive } from '../HomeLoggedIn/HomeLoggedIn.SectionFive';
import { SectionThree } from '../HomeLoggedIn/HomeLoggedIn.SectionThree';
import { FaqSection } from '../About/About.FaqSection';
import { Footer } from './Footer';

import backgroundImg from '../About/forest.jpeg';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = React.useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = React.useState(false);

  const section2Ref = React.useRef<HTMLDivElement>(null);

  const onSigInClick = () => {
    setShowCreateAccountModal(false);
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  const onCreateAccountClick = () => {
    setShowLoginModal(false);
    setShowCreateAccountModal(true);
  };

  const onForgotPasswordClick = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };
  return (
    <>
      <LoginModal
        open={showLoginModal}
        onBackdropClick={() => setShowLoginModal(false)}
        onCreateAccountClick={onCreateAccountClick}
        onForgotPasswordClick={onForgotPasswordClick}
      />
      <CreateAccountModal
        open={showCreateAccountModal}
        onBackdropClick={() => setShowCreateAccountModal(false)}
        onSigInClick={onSigInClick}
      />
      <ForgotPasswordModal
        open={showForgotPasswordModal}
        onBackdropClick={() => setShowForgotPasswordModal(false)}
        onSigInClick={onSigInClick}
      />
      <ResetPasswordModal />
      <div className={classNames('home-page', className)}>
        <div className='header-and-content-wrapper'>
          <Header onSigInClick={onSigInClick} />
          <div className='container-home'>
            <SectionOne section2Ref={section2Ref} />
            <SectionTwo ref={section2Ref} />
            <SectionFive onCreateAccountClick={onCreateAccountClick} />
            <SectionThree />
            <FaqSection />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
})`
  &.home-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto min-content;

    .header-and-content-wrapper {
      min-height: 100vh;
      display: grid;
      grid-template-rows: min-content auto;
      //background: linear-gradient(180deg, #fffbf3 18.95%, #fff 100%);

      z-index: 0;

      .header {
        z-index: 1;
      }

      .container-home {
        display: grid;

        box-sizing: border-box;
      }
    }
  }
`;
