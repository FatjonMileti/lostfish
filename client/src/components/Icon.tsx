import IcoMoon, { IconProps } from 'react-icomoon';
import iconSet from '../assets/selection.json';
import { styled } from '@mui/system';

export const Icon = styled(({ size = 24, className = '', ...props }: IconProps) => {
  return <IcoMoon className={`icon ${className}`} iconSet={iconSet} size={size} {...props} />;
})``;
