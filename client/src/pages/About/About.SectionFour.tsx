import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { CustomSection } from './CustomSection';
import backgroundImg from '../Home/home-background.png';

export const SectionFour = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <Typography variant='body1'>Frequently asked questions</Typography>
      <div className='section-content'>
        <CustomSection
          title='What information is needed to find a match?'
          description='Experts are saying there’s going to be a decrease in London property prices in the upcoming
        months, and provide information on how you can benefit.'
        />

        <CustomSection
          title='Can somebody help me with viewing the apartment?'
          description='Dolore ad nisi mollit laboris irure qui amet dolor fugiat eiusmod mollit culpa duis.
           Esse enim ipsum exercitation et elit anim qui duis incididunt laboris ex. Officia et irure irure ea.'
        />

        <CustomSection
          title='Why do I need to sign the transaction agreement?'
          description='Dolor ex ut consequat voluptate quis exercitation qui exercitation aute pariatur irure.
           Occaecat duis eiusmod excepteur ea exercitation incididunt laboris sint velit ipsum consectetur mollit.
            Eu ut deserunt sunt aliquip aliqua dolore elit amet aute mollit ea qui.
             Pariatur nulla velit laborum voluptate dolore aliquip tempor sint ut exercitation dolore.
              Consequat sit aute voluptate id Lorem esse aliqua id.
               Velit magna laborum sint nostrud amet non non commodo.'
        />
        <CustomSection
          title='How secure is my data?'
          description='Amet commodo sint est cupidatat proident velit sunt aliquip ex ullamco.
           Commodo voluptate consectetur cupidatat aliqua labore aliqua fugiat proident occaecat.
            Ea deserunt anim adipisicing deserunt eiusmod exercitation dolore officia tempor.
             Nostrud pariatur deserunt eiusmod officia consectetur est labore laboris est veniam nulla sit pariatur.
              Anim consequat mollit Lorem incididunt eiusmod laboris.'
        />
        <CustomSection
          title='Is there any assistance over the entire process?'
          description='Nisi duis qui enim duis laborum magna excepteur ipsum tempor mollit dolor.
           Commodo tempor mollit irure anim ex cillum. Proident veniam do ex laboris.
            Reprehenderit mollit Lorem qui ullamco minim.'
        />
      </div>
    </div>
  );
})`
  & {
    position: relative;
    display: grid;
    padding: 88px 36px;
    box-sizing: border-box;
    justify-items: center;
    gap: 48px;
    
    background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0) 100%, lightgray 50%);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      //background-image: url(${backgroundImg});
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      opacity: 0.1;
      z-index: -1;
    }

    .section-content {
      width: 42em;
      display: grid;
      align-items: center;
      gap: 16px;
    }
  }
`;
