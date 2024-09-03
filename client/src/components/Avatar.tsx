import { styled } from '@mui/system';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Icon } from './Icon';
import { ReactNode } from 'react';

export interface AvatarProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  image?: string;
  children?: ReactNode;
}
export const Avatar = styled(({ className, children, image, ...rest }: AvatarProps) => {
  return (
    <motion.div className={`avatar ${className}`} {...rest}>
      {children}
      {!image && <Icon icon='user' className='user-icon' />}
    </motion.div>
  );
})`
  &.avatar {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    aspect-ratio: 1/1;
    background-image: url("data:image/svg+xml,%3csvg%20width='45'%20height='65'%20viewBox='0%200%2045%2065'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M22.8024%2020.5854C31.2664%2020.5854%2038.6054%2025.3837%2042.2557%2032.4089C43.8245%2029.3861%2044.7199%2025.9577%2044.7199%2022.3226C44.7199%2010.2236%2034.9091%200.412781%2022.8101%200.412781C10.7111%200.412781%200.900269%2010.2236%200.900269%2022.3226C0.900269%2025.9577%201.79564%2029.3861%203.36445%2032.4089C7.01481%2025.3837%2014.3538%2020.5854%2022.8177%2020.5854H22.8024Z'%20fill='white'/%3e%3cpath%20d='M22.8026%2044.2402C14.3387%2044.2402%206.99968%2039.4419%203.34932%2032.4167C1.7805%2035.4395%200.885132%2038.868%200.885132%2042.503C0.885132%2054.602%2010.696%2064.4128%2022.795%2064.4128C34.8939%2064.4128%2044.7048%2054.602%2044.7048%2042.503C44.7048%2038.868%2043.8094%2035.4395%2042.2406%2032.4167C38.5902%2039.4419%2031.2512%2044.2402%2022.7873%2044.2402H22.8026Z'%20fill='white'/%3e%3cpath%20d='M35.5444%2033.8784C36.5292%2033.8784%2037.3275%2033.0801%2037.3275%2032.0953C37.3275%2031.1105%2036.5292%2030.3122%2035.5444%2030.3122C34.5597%2030.3122%2033.7614%2031.1105%2033.7614%2032.0953C33.7614%2033.0801%2034.5597%2033.8784%2035.5444%2033.8784Z'%20fill='white'/%3e%3c/svg%3e");

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: #f7f1e7;

    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    .user-icon {
      width: 50% !important;
      height: 50% !important;
      color: black;
    }
  }
`;
