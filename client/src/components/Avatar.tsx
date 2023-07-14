import { styled } from '@mui/system';
import { HTMLMotionProps, motion } from 'framer-motion';

export interface AvatarProps extends HTMLMotionProps<'div'> {
  image?: string;
}
export const Avatar = styled(({ className, ...rest }: AvatarProps) => {
  return <motion.div className={`avatar ${className}`} {...rest}></motion.div>;
})`
  &.avatar {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    aspect-ratio: 1/1;

    background-image: url(${(props) => props.image || 'initial'});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
`;
