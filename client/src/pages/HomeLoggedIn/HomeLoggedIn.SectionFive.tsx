import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import image1 from './paper1.png';
import image2 from './paper2.png';
import image3 from './paper3.png';

export const SectionFive = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const images = [image1, image2, image3];
  return (
    <div className={className}>
      <div className='title'>
        <Typography>How it works</Typography>
      </div>
      <div className='images'>
        {images.map((_, i) => (
          <div className='image' style={{ backgroundImage: `url(${images[i]})` }} key={i}>
            <div className='content'>
              <div className='username'>
                <Typography variant='body3'>No waiting, no chasing, no middlemen.</Typography>
              </div>
              <Typography variant='body4' className='bottom'>
                Our goal is to increase transparency and trust in the process to achieve the best results for
                customers in a quick, calm, and informed manner.
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
})`
  & {
    padding: 64px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
    box-sizing: border-box;

    .title {
      display: flex;
      width: 100%;
      justify-content: center;
      gap: 24px;

      .typography {
        font-weight: 400;
        line-height: 48px;
      }
    }

    .images {
      display: flex;
      align-items: flex-start;
      box-sizing: border-box;
      gap: 24px;

      .image {
        display: flex;
        width: 440px;
        height: 540px;
        align-items: flex-start;
        gap: -540px;
        border-radius: 12px;
        /* background-image: url(${image1});*/
        background-repeat: no-repeat;
        background-size: cover;

        .content {
          display: flex;
          width: 440px;
          height: 540px;
          box-sizing: border-box;
          padding: 32px;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 60%, #000 100%);

          .username {
            display: flex;
            align-items: flex-start;
            gap: 10px;

            .typography {
              color: #fff;
              font-weight: 600;
            }
          }
          .bottom {
            color: #fff;
            font-weight: 400;
          }
        }
      }
    }
  }
`;
