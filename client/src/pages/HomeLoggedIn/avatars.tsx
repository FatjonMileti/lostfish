import avatar0 from '../MyAccount/images/fancy-avatar-0.jpg';
import avatar1 from '../MyAccount/images/fancy-avatar-1.jpg';
import avatar2 from '../MyAccount/images/fancy-avatar-2.jpg';
import avatar3 from '../MyAccount/images/fancy-avatar-3.jpg';
import avatar4 from '../MyAccount/images/fancy-avatar-4.jpg';
import avatar5 from '../MyAccount/images/fancy-avatar-5.jpg';
import lostfishLogoColored from '../../assets/svg/LogoLostFishColored.svg';

export type AvatarType = { image: string; backgroundColor: string };

export const getAvatarFormIndex = (avatarkey: string = ''): string => {
  // if (isNaN(parseInt(avatarkey))) return '';
  const parsedAvatarIndex = parseInt(avatarkey);
  return (
    avatars[parsedAvatarIndex]?.image ||
    {
      lostfish: agentAvatar
    }[avatarkey]?.image ||
    ''
  );
};

export const avatars: AvatarType[] = [
  {
    image: avatar0,
    backgroundColor: '#F7AC75'
  },
  {
    image: avatar1,
    backgroundColor: '#F7AC75'
  },
  {
    image: avatar2,
    backgroundColor: '#FDDF44'
  },
  {
    image: avatar3,
    backgroundColor: '#3DE2E2'
  },
  {
    image: avatar4,
    backgroundColor: '#184D6D'
  },
  {
    image: avatar5,
    backgroundColor: '#408140'
  }
];

const agentAvatar: AvatarType = {
  image: lostfishLogoColored,
  backgroundColor: 'white'
};
