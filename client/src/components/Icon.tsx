import IcoMoon, { IconProps } from 'react-icomoon';
import iconSet from '../assets/selection.json';
import { styled } from '@mui/system';

import { IconNames } from '../assets/icon';

export interface IconPropsSpecific extends Omit<IconProps, 'icon'> {
  icon: IconNames;
}

export const Icon = styled(({ size = 24, className = '', ...props }: IconPropsSpecific) => {
  return <IcoMoon className={`icon ${className}`} iconSet={iconSet} size={size} {...props} />;
})``;
