import styled from '@emotion/styled';

import { Footer } from '../Home/Footer';
import { Header } from './Header';
import { Intersection } from '../Home/Intersection';

export const HomeLoggedIn = styled(({ className = '' }) => {
  return (
    <div className={className}>
      <Header />
      <Intersection />
      <Footer />
    </div>
  );
})`
  max-width: 1440px;
  margin-inline: auto;
`;
