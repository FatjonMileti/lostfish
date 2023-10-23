import { styled } from '@mui/system';
import { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { avatars } from '../HomeLoggedIn/avatars';

export const SectionOne = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className}>
      <div className='section-content'>
          <div className='bottom'>
            <Avatar image={avatars[1].image} />
            <div className='right'>
              <Typography variant='body2'>
                “Using Lostfish has changed the way I search for a place I can call home. Super easy to use,
                secure & transparent with curated listings that match exactly what I was looking for”
              </Typography>
              <div className='username-button'>
                <div className='username'>
                  <Typography variant='body3'>Randy Rosser</Typography>
                  <Typography variant='body5'>Found his home in 4 hours</Typography>
                </div>
                <Button active={false} inverted size='small'>
                  Add a review
                </Button>
              </div>
            </div>
          </div>

      </div>
    </div>
  );
})`
  & {
    width: 100%;
    display: flex;
    padding: 64px 36px;
    justify-content: center;
    align-items: flex-start;
    gap: 24px;
    box-sizing: border-box;
    opacity: 1;
    position: relative;
    z-index: 1;
    background: #fff;

    .section-content {
      width: 100%;
      display: grid;
      align-items: center;
      justify-content: center;
      gap: 48px;

        .bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;

          .avatar {
            width: 25em;
            height: 25em;
            flex-shrink: 0;
          }

          .right {
            width: 42em;
            display: grid;
            gap: 48px;

            .typography {
              font-style: italic;
              font-weight: 400;
              line-height: 40px;
            }

            .username-button {
              display: grid;
              align-items: center;
              grid-template-columns: auto auto;
              justify-content: space-between;

              .username {
                display: grid;
                gap: 8px;

                .body3 {
                  font-weight: 700;
                  line-height: 32px;
                }

                .body5 {
                  font-weight: 600;
                  line-height: 16px;
                  color: #a7a7a7;
                }
              }

              .button {
                border: 2px solid #184d6d;
                color: #184d6d;

                &:hover {
                  background: #184d6d;
                  color: #fff;
                }
              }
            }
          }
        }
      
    }
  }
`;
