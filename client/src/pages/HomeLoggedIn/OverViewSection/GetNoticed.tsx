import { styled } from '@mui/system';
import { HTMLProps } from 'react';
import { Icon, Typography } from '../../../components';
import classNames from 'classnames';

interface GetNoticedProps extends HTMLProps<HTMLDivElement> {}
export const GetNoticed = styled(({ className }: GetNoticedProps) => {
  return (
    <div className={classNames('get-noticed', className)}>
      <div className='title-and-icon-wrapper'>
        <Icon className='star-icon' icon='star' />
        <Typography className='title' variant='body3'>
          Get noticed!
        </Typography>
      </div>
      <Typography variant='body4' className='description'>
        Add more information to your profile to improve your chances of landing your perfect match.
      </Typography>
    </div>
  );
})`
  &.get-noticed {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    box-sizing: border-box;

    .title-and-icon-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 8px;

      .title {
        font-weight: 900;
      }

      .description {
        align-self: stretch;
      }
    }
  }
`;
