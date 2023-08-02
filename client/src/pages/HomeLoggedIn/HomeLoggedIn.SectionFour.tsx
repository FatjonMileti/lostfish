import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { avatars } from './avatars';
import { Button } from '../../components/Button';
import verified from '../MyAccount/images/verified.svg';

export const SectionFour = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const usernames = [
    'Nancy Jones',
    'Nick Young',
    'Marcus Korsgaard',
    'Lindsey Siphron',
    'Leo Korsgaard',
    'Phillip Dokidis'
  ];
  return (
    <div className={className}>
      <div className='title'>
        <Typography>Your recent matches</Typography>
      </div>
      <div className='avatars'>
        {avatars.map((_, i) => (
          <Avatar image={avatars[i].image} className='avatar' key={i}>
            <div className='content'>
              <div className='username'>
                <Typography variant='body4'>
                  {usernames[i]}
                  <img src={verified} alt='verified' />
                </Typography>
              </div>
              <div className='bottom'>
                <Button active={false} inverted>
                  View profile
                </Button>
              </div>
            </div>
          </Avatar>
        ))}
      </div>
      <div className='bottom'>
        <Button active={false} inverted size='large'>
          View all matches
        </Button>
      </div>
    </div>
  );
})`
  & {
    width: 100%;
    padding: 64px 0px 32px 36px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    box-sizing: border-box;

    .title {
      gap: 24px;
      display: flex;
      justify-content: center;
      align-items: flex-start;

      .typography {
        font-weight: 400;
        line-height: 48px;
      }
    }

    .avatars {
      display: flex;
      width: 100%;
      align-items: flex-start;
      gap: 16px;
      overflow-x: hidden;
      box-sizing: border-box;
      align-self: stretch;
      margin-right: -69px;

      .avatar {
        display: flex;
        width: 232px;
        height: 328px;
        flex-direction: column-reverse;
        align-items: center;
        gap: -120px;
        border-radius: 12px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.05);

        .content {
          display: flex;
          padding: 16px;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 200px;
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(38, 38, 38, 0) 0%, rgba(38, 38, 38, 0.7) 43.75%);

          .username {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;

            .typography {
              color: #fff;
              font-weight: 700;
              display: grid;
              grid-template-columns: max-content min-content;
              align-items: center;
              column-gap: 8px;
            }
          }
          .bottom {
            .button {
              color: #fff;
              background: none;
              padding: 12px 20px;
              border: 2px solid #fff;
              border-radius: 250px;
              font-family: Roobert;
              font-size: 14px;
              font-weight: 600;
            }
          }
        }
      }
    }

    .bottom {
      .button {
        color: #184d6d;
        background: none;
        padding: 20px 32px;
        border: 2px solid #184d6d;
        border-radius: 250px;
        font-family: Roobert;
        font-size: 18px;
        font-weight: 600;

        &:hover {
          background: #184d6d;
          color: #fff;
        }
      }
    }
  }
`;
