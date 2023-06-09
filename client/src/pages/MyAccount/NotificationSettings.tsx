import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Typography } from '../../components/Typography';
import { Switch } from '../../components/Switch';
import { useUser } from '../../context/UserProvider';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../utils/axios';
import { useGlobalState } from '../../globalState';

const userNotificationSchema = yup.object().shape({
  email_me_when_i_get_a_match: yup.boolean(),
  text_when_i_get_a_match: yup.boolean(),
  email_when_someone_accept_my_match: yup.boolean(),
  text_when_someone_accept_my_match: yup.boolean()
});

interface FormData {
  email_me_when_i_get_a_match: boolean;
  text_when_i_get_a_match: boolean;
  email_when_someone_accept_my_match: boolean;
  text_when_someone_accept_my_match: boolean;
}

type CheckBoxName =
  | 'email_me_when_i_get_a_match'
  | 'text_when_i_get_a_match'
  | 'email_when_someone_accept_my_match'
  | 'text_when_someone_accept_my_match';

export const NotificationSettings = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { user, getOne } = useUser();

  const {
    user: [{ auth, userDetails }]
  } = useGlobalState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(userNotificationSchema),
    defaultValues: {
      email_me_when_i_get_a_match: false,
      text_when_i_get_a_match: false,
      email_when_someone_accept_my_match: false,
      text_when_someone_accept_my_match: false
    }
  });

  React.useEffect(() => {
    getNotifications();
  }, [user]);

  const getNotifications = () => {
    if (user) {
      const { notification } = user;
      if (notification) {
        const {
          email_me_when_i_get_a_match,
          text_when_i_get_a_match,
          email_when_someone_accept_my_match,
          text_when_someone_accept_my_match
        } = notification;

        setValue('email_me_when_i_get_a_match', email_me_when_i_get_a_match);
        setValue('text_when_i_get_a_match', text_when_i_get_a_match);
        setValue('email_when_someone_accept_my_match', email_when_someone_accept_my_match);
        setValue('text_when_someone_accept_my_match', text_when_someone_accept_my_match);
      }
    }
  };

  const onSubmit = async (data: any) => {
    const response = await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, {
      notification: data
    });
    if (response.status === 200) {
      getOne();
      alert('Updated with success!');
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.name as CheckBoxName, e.target.checked);
    handleSubmit(onSubmit)();
  };

  if (!user) {
    return <div>Loader...</div>;
  }

  return (
    <div className={`notification-settings ${className}`}>
      <Typography variant='body4'>Matches notifications</Typography>
      <form className='notification-list'>
        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Email me when I get a match
            </Typography>
            <Typography variant='body4'>You will receive an email whenever you got a new match.</Typography>
          </div>
          <Controller
            name='email_me_when_i_get_a_match'
            control={control}
            render={({ field }) => {
              return <Switch {...field} size='small' checked={field.value} onChange={handleOnChange} />;
            }}
          />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Text me when I get a match
            </Typography>
            <Typography variant='body4'>You will receive an SMS whenever you got a new match.</Typography>
          </div>
          <Controller
            name='text_when_i_get_a_match'
            control={control}
            render={({ field }) => {
              return <Switch {...field} size='small' checked={field.value} onChange={handleOnChange} />;
            }}
          />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Email me when someone accepts my match
            </Typography>
            <Typography variant='body4'>
              You will receive an email when someone accepts your match.
            </Typography>
          </div>
          <Controller
            name='email_when_someone_accept_my_match'
            control={control}
            render={({ field }) => {
              return <Switch {...field} size='small' checked={field.value} onChange={handleOnChange} />;
            }}
          />
        </div>

        <div className='notification'>
          <div className='texts'>
            <Typography variant='body4' className='title'>
              Text me when someone accepts my match
            </Typography>
            <Typography variant='body4'>You will receive an SMS when someone accepts your match.</Typography>
          </div>
          <Controller
            name='text_when_someone_accept_my_match'
            control={control}
            render={({ field }) => {
              return <Switch {...field} size='small' checked={field.value} onChange={handleOnChange} />;
            }}
          />
        </div>
      </form>
    </div>
  );
})`
  &.notification-settings {
    display: grid;
    row-gap: 16px;
    .notification-list {
      display: grid;
      row-gap: 8px;
      .notification {
        display: grid;
        grid-template-columns: auto min-content;
        align-items: center;
        column-gap: 24px;

        background-color: #f3f4f5;
        border-radius: 8px;
        padding: 16px;
        max-width: 556px;

        .texts {
          display: grid;
          row-gap: 8px;
          .title {
            font-weight: 600;
          }
        }
      }
    }
  }
`;
