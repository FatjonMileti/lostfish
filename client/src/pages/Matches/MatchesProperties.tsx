import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';

interface MatchesPropertiesProps extends HTMLAttributes<HTMLDivElement> {}
export const MatchesProperties = styled(({ className }: MatchesPropertiesProps) => {
  return (
    <div className={`${className}`}>
      <Typography>
        Matching with <span className='matching-with'>buyers in Bristol +</span>
      </Typography>
      <Typography variant='body5' className='sub-title'>
        Displaying 1240 matches. Enter more details to refine your search.
      </Typography>
    </div>
  );
})`
  & {
    .matching-with {
      color: #184d6d;
      border-bottom: 1px solid #184d6d;
    }

    .sub-title {
      margin-top: 8px;
    }
  }
`;
