import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import classNames from 'classnames';

import { Typography } from '../../components/Typography';

import { FaqComponent } from './FaqComponent';

import backgroundImg from './home-background.png';

export const FaqSection = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={classNames('faq-section', className)}>
      <Typography variant='body2' className='section-title'>Frequently asked questions</Typography>
      <div className='section-content'>
        <FaqComponent
          title='What information is needed to find a match?'
          descriptionForTenants='Provide your preferred location, property size, desired amenities, budget,
           and any other specific criteria. The more information you provide, the better our AI can find your
           dream home. Think of it as telling us your property wish list – minus the fairy godmother.'
          descriptionForLandlords='Add your property with details like location, number of bedrooms, and price.
           Upload photos, floorplans, and a photo of your ID and a recent utility bill (because security is no
           joke). Our AI will then match your property with the best tenants, like a property Cupid.'
        />

        <FaqComponent
          title='Can somebody help me with viewing the apartment?'
          descriptionForTenants='Dolore ad nisi mollit laboris irure qui amet dolor fugiat eiusmod mollit culpa duis.
           Esse enim ipsum exercitation et elit anim qui duis incididunt laboris ex. Officia et irure irure ea.'
          descriptionForLandlords='Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
           esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
           in culpa qui officia deserunt mollit anim id est laborum.'
        />

        <FaqComponent
          title='Why do I need to sign the transaction agreement?'
          descriptionForTenants='Dolor ex ut consequat voluptate quis exercitation qui exercitation aute pariatur irure.
           Occaecat duis eiusmod excepteur ea exercitation incididunt laboris sint velit ipsum consectetur mollit.
            Eu ut deserunt sunt aliquip aliqua dolore elit amet aute mollit ea qui.
             Pariatur nulla velit laborum voluptate dolore aliquip tempor sint ut exercitation dolore.
              Consequat sit aute voluptate id Lorem esse aliqua id.
               Velit magna laborum sint nostrud amet non non commodo.'
          descriptionForLandlords='Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
           esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
           in culpa qui officia deserunt mollit anim id est laborum.'
        />
        <FaqComponent
          title='How secure is my data?'
          descriptionForTenants='Amet commodo sint est cupidatat proident velit sunt aliquip ex ullamco.
           Commodo voluptate consectetur cupidatat aliqua labore aliqua fugiat proident occaecat.
            Ea deserunt anim adipisicing deserunt eiusmod exercitation dolore officia tempor.
             Nostrud pariatur deserunt eiusmod officia consectetur est labore laboris est veniam nulla sit pariatur.
              Anim consequat mollit Lorem incididunt eiusmod laboris.'
          descriptionForLandlords='Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
           esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
           in culpa qui officia deserunt mollit anim id est laborum.'
        />
        <FaqComponent
          title='Is there any assistance over the entire process?'
          descriptionForTenants='Nisi duis qui enim duis laborum magna excepteur ipsum tempor mollit dolor.
           Commodo tempor mollit irure anim ex cillum. Proident veniam do ex laboris.
            Reprehenderit mollit Lorem qui ullamco minim.'
          descriptionForLandlords='Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
           nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
           esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
           in culpa qui officia deserunt mollit anim id est laborum.'
        />
      </div>
    </div>
  );
})`
  &.faq-section {
    position: relative;
    display: grid;
    padding: 48px 36px;
    box-sizing: border-box;
    justify-items: center;
    gap: 48px;
    background-color: #F3F4F5;

    .section-title {
      font-weight: 600;
      line-height: 48px;
    }
    .section-content {
      min-width: 904px;
      display: grid;
      align-items: center;
      gap: 16px;
    }
  }
`;
