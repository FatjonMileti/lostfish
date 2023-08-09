import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';

export const SectionZero = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={className}>
            <div className='section-content'>
                <div className='welcome'>
                    <Typography className='bold'>Reimagining how you get to find your perfect home.</Typography>
                    <Typography variant='body4' className='texts'>
                        Our goal is to revolutionise the property industry by using technology and data to empower and
                        inform customers in the buying, selling, and renting process.
                    </Typography>
                </div>

            </div>
        </div>
    );
})`
  & {
    width: 100%;
    display: flex;
    padding: 0 36px;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    box-sizing: border-box;
    opacity: 1;
    position: relative;
    z-index: 1;
    margin-top: 170px;
    
    .section-content {
      width: 100%;
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

      .welcome {
        display: flex;
        width: 42em;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        margin: 0 auto;

        .bold {
          text-align: center;
          font-size: 56px;
          font-weight: 400;
          line-height: 64px;
        }

        .texts {
          text-align: center;
          font-weight: 400;
        }
      }
    }
  }
`;
