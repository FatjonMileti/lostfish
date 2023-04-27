import { styled } from '@mui/system';

import { Footer } from '../Home/Footer';
import { Header } from './Header';
import { Intersection } from '../Home/Intersection';
import { WhatDoWeDo } from '../Home/WhatDoWeDo';
import { WhatDefinedUs } from '../Home/WhatDefinedUs';
import { BuildingsIllustration } from '../Home/BuildingsIllustration';
import React from 'react';
import { DailyNews } from '../Home/DailyNews';

export const HomeLoggedIn = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <Header />
      <Intersection />
      <WhatDoWeDo />
      <DailyNews />
      <BuildingsIllustration />
      <WhatDefinedUs />
      <Footer />
    </div>
  );
})`
  max-width: 1440px;
  margin-inline: auto;
`;
