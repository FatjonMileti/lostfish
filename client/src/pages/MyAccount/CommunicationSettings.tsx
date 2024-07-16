import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Switch, Typography } from '../../components';
import { Button } from '../../components';
import { InfoCard } from './components/InfoCard.tsx';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../utils/axios';

import { useUserStore } from '../../globalState/user';
import { useUser } from '../../context/UserProvider.tsx';
import * as yup from 'yup';

const userNotificationSchema = yup.object().shape({
  email_updates: yup.boolean(),
  sms_updates: yup.boolean(),
  desktop_notification: yup.boolean(),
  offers_updates: yup.boolean(),
  news_updates: yup.boolean()
});

interface FormData {
  email_updates: boolean;
  sms_updates: boolean;
  desktop_notification: boolean;
  offers_updates: boolean;
  news_updates: boolean;
}

type CheckBoxName =
  | 'email_updates'
  | 'sms_updates'
  | 'desktop_notification'
  | 'offers_updates'
  | 'news_updates';

export const CommunicationSettings = styled(({ className }: HTMLAttributes<HTMLDivElement>) => {
  const { user, getOne } = useUser();
  const { userDetails, auth } = useUserStore();

  const { control, handleSubmit, setValue } = useForm<FormData>({
    resolver: yupResolver(userNotificationSchema),
    defaultValues: {
      email_updates: false,
      sms_updates: false,
      desktop_notification: false,
      offers_updates: false,
      news_updates: false
    }
  });

  React.useEffect(() => {
    getNotifications();
  }, [user]);

  const getNotifications = () => {
    if (user) {
      const { notification } = user;
      if (notification) {
        const { email_updates, sms_updates, desktop_notification, offers_updates, news_updates } =
          notification;

        setValue('email_updates', email_updates);
        setValue('sms_updates', sms_updates);
        setValue('desktop_notification', desktop_notification);
        setValue('offers_updates', offers_updates);
        setValue('news_updates', news_updates);
      }
    }
  };

  const onSubmit = async (data: any) => {
    const response = await axios(auth.access_token).patch('/api/user/' + userDetails.user_id, {
      notification: data
    });
    if (response.status === 200) {
      getOne();
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.name as CheckBoxName, e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`communication-settings ${className}`}>
      <div className='communication-settings-header'>
        <Typography variant='body2' className='section-title'>
          Communication settings
        </Typography>
        <Button type='submit' size='medium' className='submit-button'>
          Save changes
        </Button>
      </div>
      <div className='section-wrapper'>
        <div className='communication-settings-wrapper'>
          <div className='section'>
            <Typography variant='body3' className='title'>
              Account notifications
            </Typography>
            <div className='notification-list'>
              <div className='notification'>
                <div className='texts'>
                  <Typography variant='body4' className='notification-title'>
                    Email updates
                  </Typography>
                  <Typography variant='body6' className='notification-description'>
                    Receive email updates about the status of your matches, messages received as well as
                    updates on legal documents upload.
                  </Typography>
                </div>
                <Controller
                  name='email_updates'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Switch {...field} size='medium' checked={field.value} onChange={handleOnChange} />
                    );
                  }}
                />
              </div>
              <div className='notification'>
                <div className='texts'>
                  <Typography variant='body4' className='notification-title'>
                    SMS updates
                  </Typography>
                  <Typography variant='body6' className='notification-description'>
                    Receive SMS updates about the status of your matches, messages received as well as updates
                    on legal documents upload.
                  </Typography>
                </div>
                <Controller
                  name='sms_updates'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Switch {...field} size='medium' checked={field.value} onChange={handleOnChange} />
                    );
                  }}
                />
              </div>
              <div className='notification'>
                <div className='texts'>
                  <Typography variant='body4' className='notification-title'>
                    Desktop notifications
                  </Typography>
                  <Typography variant='body6' className='notification-description'>
                    Turn on notifications to get notified of new responses on your device.
                  </Typography>
                </div>
                <Controller
                  name='desktop_notification'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Switch {...field} size='medium' checked={field.value} onChange={handleOnChange} />
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className='section'>
            <Typography variant='body3' className='title'>
              Marketing notifications
            </Typography>
            <div className='notification-list'>
              <div className='notification'>
                <div className='texts'>
                  <Typography variant='body4' className='notification-title'>
                    Offers updates
                  </Typography>
                  <Typography variant='body6' className='notification-description'>
                    Receive email updates about special offers and discounts.
                  </Typography>
                </div>
                <Controller
                  name='offers_updates'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Switch {...field} size='medium' checked={field.value} onChange={handleOnChange} />
                    );
                  }}
                />
              </div>
              <div className='notification'>
                <div className='texts'>
                  <Typography variant='body4' className='notification-title'>
                    News updates
                  </Typography>
                  <Typography variant='body6' className='notification-description'>
                    Receive email updates about new articles published.
                  </Typography>
                </div>
                <Controller
                  name='news_updates'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Switch {...field} size='medium' checked={field.value} onChange={handleOnChange} />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='right-part'>
          {/*TODO: change icon*/}
          <InfoCard
            icon='info'
            title='Why enable desktop notifications?'
            description='With desktop notifications enabled you will get notified instantly once you have a match, you receive a message or Lostfish updates directly from your account.'
          />
        </div>
      </div>
    </form>
  );
})`
  &.communication-settings {
    display: grid;
    gap: 40px;

    .communication-settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .section-title {
        color: #0d2a38;
        font-weight: 600;
        line-height: 48px;
      }

      .submit-button {
        padding: 12px 24px;
      }
    }

    .section-wrapper {
      position: relative;
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      justify-content: space-between;
      column-gap: 32px;

      .communication-settings-wrapper {
        display: grid;
        grid-template-rows: min-content auto;
        row-gap: 24px;
        max-width: 556px;

        .section {
          display: grid;
          grid-template-rows: min-content auto;
          gap: 16px;

          .title {
            color: #0d2a38;
            font-weight: 900;
          }

          .notification-list {
            display: grid;
            gap: 8px;

            .notification {
              display: flex;
              padding: 24px;
              align-items: center;
              justify-content: space-between;
              gap: 16px;

              border-radius: 8px;
              border: 1px solid #e7e7e7;

              .texts {
                display: grid;
                gap: 4px;

                .notification-title {
                  color: #0d2a38;
                  font-size: 18px;
                  font-weight: 900;
                }

                .notification-description {
                  color: #646464;
                  font-weight: 500;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }

      .right-part {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
      }
    }
  }
`;
