import IcoMoon, { IconProps } from 'react-icomoon';
import iconSet from '../assets/selection.json';

const Icon = ({ size = 24, ...props }: IconProps) => <IcoMoon iconSet={iconSet} size={size} {...props} />;

export default Icon;
