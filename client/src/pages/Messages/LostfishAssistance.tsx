import { HTMLAttributes } from 'react';
import { styled } from '@mui/system';
import { Avatar, Typography } from '../../components';
import { getAvatarFormIndex } from '../HomeLoggedIn/avatars.tsx';
import { useUserStore } from '../../globalState/user.tsx';

export const LostfishAssistance = styled(({ className, room }: HTMLAttributes<HTMLDivElement>) => {
  const userStore = useUserStore();
  const avatarKey =
    userStore.userDetails?.user_id === room?.author?._id ? room?.participant?.avatar : room?.author?.avatar;

  const avatar = getAvatarFormIndex(avatarKey);

  console.log(room);
  return room && !room?.property ? (
    <div className={`lostfish-assistance ${className}`}>
      <div className='section'>
        <div className='logo-title-wrapper'>
          <Avatar image={avatar} className='lostfish' />
          <Typography variant='body3' className='title'>
            Lostfish
          </Typography>
        </div>
      </div>
      <div>aaa</div>
      <div>aaa</div>
    </div>
  ) : (
    <div />
  );
})`
  &.lostfish-assistance {
    border-radius: 16px;
    display: grid;
    padding: 24px;
    gap: 24px;
    box-sizing: border-box;
    align-content: flex-start;
    height: 100%;

    .section {
      display: grid;
      gap: 16px;

      .logo-title-wrapper {
        display: flex;
        gap: 16px;
        align-items: center;

        .lostfish {
          background-size: 32px 32px;
          background-color: #b4263b;
        }
      }
    }
  }
`;
