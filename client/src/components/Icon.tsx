import IcoMoon, { IconProps } from 'react-icomoon';
import iconSet from '../assets/selection.json';
import styled from '@emotion/styled';

export const Icon = styled(({ size = 24, className = '', ...props }: IconProps) => {
  return <IcoMoon className={` ${className}`} iconSet={iconSet} size={size} {...props} />;
})``;
