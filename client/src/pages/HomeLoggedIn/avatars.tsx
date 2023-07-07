import avatar1 from '../MyAccount/images/avatar1.svg';
import avatar2 from '../MyAccount/images/avatar2.svg';
import avatar3 from '../MyAccount/images/avatar3.svg';
import avatar4 from '../MyAccount/images/avatar4.svg';
import avatar5 from '../MyAccount/images/avatar5.svg';

export type AvatarType = { image: string; backgroundColor: string };

export const avatars: AvatarType[] = [
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
