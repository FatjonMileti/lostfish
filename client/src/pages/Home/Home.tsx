import React from 'react';
import { styled } from '@mui/system';
import classNames from 'classnames';

import { Header } from './Header';
import { LoginModal } from '../Login/LoginModal';
import { CreateAccountModal } from '../CreateAccount/CreateAccountmodal';
import { ForgotPasswordModal } from '../ForgotPassword/ForgotPasswordModal';
import { ResetPasswordModal } from '../ResetPassword/ResetPasswordModal';
import { SectionOne } from './Home.SectionOne';
import { SectionTwo } from './Home.SectionTwo';
import { ColoredCards } from './Home.ColoredCards';
import { DailyNews } from './Home.DailyNews';
import { FaqSection } from './Home.FaqSection';
import { Footer } from './Footer';

import { StartMatchingWithoutAccount } from '../Suggestions/StartMatchingWithoutAccount/StartMatchingWithoutAccount';
import HomeCirclesSection from './Home.CirclesSection.tsx';

export const Home = styled(({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [showStartMatching, setShowStartMatching] = React.useState(false);

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
          <Header
            onSigInClick={onSigInClick}
            onRegisterClick={onCreateAccountClick}
          />

          <div className='container-home'>
            {showStartMatching && (
              <StartMatchingWithoutAccount
                closeStartMatching={() => setShowStartMatching(false)}
                onSigInClick={onSigInClick}
                onCreateAccountClick={onCreateAccountClick}
              />
            )}

            {!showStartMatching && (
              <>
                <SectionOne
                  section2Ref={section2Ref}
                  onStartMatchingClick={() => setShowStartMatching(true)}
                />

                <SectionTwo ref={section2Ref} />
                <HomeCirclesSection />

                <ColoredCards onCreateAccountClick={onCreateAccountClick} />

                <DailyNews />
                <FaqSection />
              </>
            )}
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

      .container-home {
        display: grid;

        box-sizing: border-box;
      }
    }
  }
`;
