import avatar0 from '../MyAccount/images/pierre at desk cream.png';
import avatar1 from '../MyAccount/images/Dan.png';
import avatar2 from '../MyAccount/images/girl on phone.png';
import avatar3 from '../MyAccount/images/Jess.png';
import avatar4 from '../MyAccount/images/Jordan.png';
import avatar5 from '../MyAccount/images/Mathew.png';
import avatar6 from '../MyAccount/images/Olivia .png';
import avatar7 from '../MyAccount/images/Reme .png';
import avatar8 from '../MyAccount/images/Steve.png';
import avatar9 from '../MyAccount/images/Sue.png';
import avatar10 from '../MyAccount/images/zoe_.png';
import avatar11 from '../MyAccount/images/antony.png';
import lostfishLogoColored from '../../assets/svg/lostfish-white.svg';

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
  },
  {
    image: avatar6,
    backgroundColor: '#408140'
  },
  {
    image: avatar7,
    backgroundColor: '#408140'
  },
  {
    image: avatar8,
    backgroundColor: '#408140'
  },
  {
    image: avatar9,
    backgroundColor: '#408140'
  },
  {
    image: avatar10,
    backgroundColor: '#408140'
  },
  {
    image: avatar11,
    backgroundColor: '#408140'
  }
];

const agentAvatar: AvatarType = {
  image: lostfishLogoColored,
  backgroundColor: '#184D6D'
};
