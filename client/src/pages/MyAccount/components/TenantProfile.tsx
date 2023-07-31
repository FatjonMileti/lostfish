import { Avatar } from '../../../components/Avatar';
import { avatars } from '../../HomeLoggedIn/avatars';
import { Typography } from '../../../components/Typography';
import verified from '../images/verified.svg';
import { Link } from '../../../components/Link';
import React from 'react';

interface ITenant {
  first_name: string;
  last_name: string;
  _id: string;
  avatar: string;
}
interface ITenantProps {
  tenant: ITenant;
}

export const TenantProfile = (props: ITenantProps) => {
  const { tenant } = props;
  return (
    <div className='tenant'>
      <Avatar image={avatars[parseInt(tenant.avatar)]?.image} className='profile-image' />
      <Typography className='tenant-name' variant='body4'>
        {`${tenant.first_name} ${tenant.last_name}`}
        <img src={verified} alt='verified' />
      </Typography>
      <Link>View profile</Link>
    </div>
  );
};
