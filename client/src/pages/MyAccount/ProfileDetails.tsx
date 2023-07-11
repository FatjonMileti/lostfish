import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Textarea } from '../../components/Textarea';
import { motion } from 'framer-motion';

import { Icon } from '../../components/Icon';
import { useGlobalState } from '../../globalState/globalState';
import axios from '../../utils/axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Can from '../../components/Can';
import { CASLAction } from '../../utils/ability.util';
import { avatars } from '../HomeLoggedIn/avatars';
import { Backdrop } from '../../components/Backdrop';
import { useUserStore } from '../Login/Login';

const userSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required'),
  phone: yup.string().nullable(),
  description: yup.string().nullable()
});

interface ProfileDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  avatar: number;
}

export const ProfileDetails = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const [loading, setLoading] = React.useState(false);

  const {
    userProfile: [userProfile, setUserProfile]
  } = useGlobalState();

  const { userDetails, auth } = useUserStore();

  const profileDetailsForm = useForm<ProfileDetails>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      description: '',
      avatar: userProfile.avatar
    }
  });

  const handleSelectedAvatar = (index: number) => {
    profileDetailsForm.setValue('avatar', index);
  };

  React.useEffect(() => {
    profileDetailsForm.watch();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios(auth.access_token).get('/api/account/me');
      setUserProfile({ ...data });

      const { first_name, last_name, email, phone, description, avatar } = data;

      profileDetailsForm.setValue('first_name', first_name);
      profileDetailsForm.setValue('last_name', last_name);
      profileDetailsForm.setValue('email', email);
      profileDetailsForm.setValue('phone', phone);
      profileDetailsForm.setValue('description', description);
      profileDetailsForm.setValue('avatar', parseInt(avatar));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  console.log('userProfile', userProfile);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, data);

      await loadProfile();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop open={loading} />
      <form onSubmit={profileDetailsForm.handleSubmit(onSubmit)} className={`profile-details ${className}`}>
        <div className='left-part'>
          <div className='section'>
            <Typography className='section-title' variant='body4'>
              Contact information
            </Typography>
            <div className='contact-information'>
              <TextField
                label='First Name'
                {...profileDetailsForm.register('first_name')}
                error={!!profileDetailsForm.formState.errors?.first_name}
                helperText={profileDetailsForm.formState.errors?.first_name?.message}
              />
              <TextField
                label='Last Name'
                {...profileDetailsForm.register('last_name')}
                error={!!profileDetailsForm.formState.errors?.last_name}
                helperText={profileDetailsForm.formState.errors?.last_name?.message}
              />
              <TextField
                label='Email'
                {...profileDetailsForm.register('email')}
                error={!!profileDetailsForm.formState.errors?.email}
                helperText={profileDetailsForm.formState.errors?.email?.message}
              />
              <TextField label='Phone' {...profileDetailsForm.register('phone')} />
            </div>
          </div>

          <div className='section'>
            <Typography className='section-title' variant='body4'>
              Personal details
            </Typography>
            <div className='personal-details'>
              <Textarea
                rows={6}
                label='Describe yourself (your matches will see this)'
                {...profileDetailsForm.register('description')}
                defaultValue=''></Textarea>
            </div>
          </div>

          <div className='section'>
            <Typography className='section-title' variant='body4'>
              Setup avatar
            </Typography>
            <div className='setup-avatar'>
              {avatars.map(({ image, backgroundColor }, avatarIndex) => {
                const active = avatarIndex === profileDetailsForm.getValues('avatar');

                return (
                  <motion.div
                    // whileTap={{ scale: 0.9 }}
                    // whileHover={{ scale: 1.5 }}
                    onClick={() => handleSelectedAvatar(avatarIndex)}
                    key={avatarIndex}
                    className={`avatar ${active ? 'active' : ''}`}
                    style={{ backgroundColor }}>
                    <img src={image} />
                    <Icon icon='checked' color='black' size={10} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='right-part'>
          <Can do={CASLAction.Update} on='User'>
            <Button type='submit'>Save changes</Button>
          </Can>
        </div>
      </form>
    </>
  );
})`
  &.profile-details {
    display: grid;
    grid-template-columns: 50% 50%;
    min-height: 100%;

    .left-part {
      display: grid;
      row-gap: 32px;
      align-content: flex-start;
    }

    .right-part {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }

    .section {
      display: grid;
      row-gap: 16px;
      .section-title {
        color: #646464;
      }
    }

    .contact-information {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
    }

    .personal-details {
    }

    .setup-avatar {
      display: flex;
      column-gap: 20px;

      .avatar {
        position: relative;
        border-radius: 50%;
        cursor: pointer;
        height: 72px;
        width: 72px;
        box-sizing: border-box;
        display: flex;

        img {
          border-radius: 50%;
        }

        &.active {
          outline: 2px solid #c0daff;

          :before {
            content: '';
            z-index: 1;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            border: 2px solid #c0daff;
            position: absolute;
          }

          .icon {
            position: absolute;
            z-index: 4;
            bottom: -8px;
            background: #c0daff;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 50%;
            padding: 4px;
          }
        }
      }
    }
  }
`;
