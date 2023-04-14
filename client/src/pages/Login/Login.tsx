import styled from '@emotion/styled';
import loginIllustration from './loginIllustration.svg';
import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';

export const Login = styled(({ className }: { className?: string }) => {
  return (
    <div className={`login-page ${className}`}>
      <div className='left-part'>
        <Typography variant='h1' className='main-title'>
          See what’s in it for you.
        </Typography>

        <div className='content'>
          <Typography variant='body4' className='description'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore aliqua.
          </Typography>
          <div>
            <TextField label='Email' className='email-input' required />
            <TextField type='password' label='Password' className='email-password' required />
            <Button variant='outlined' startIcon={<Icon icon='arrow-right' color='white' />}>
              Sign in
            </Button>
          </div>
        </div>
      </div>
      <div className='right-part'></div>
    </div>
  );
})`
  display: grid;
  grid-template-columns: 10fr 13fr;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);

  .left-part {
    padding-left: 36px;
    padding-right: 24px;
    .main-title {
      margin-top: 176px;
    }

    .content {
      max-width: 440px;

      .description {
        margin-top: 24px;
      }

      .email-input {
        margin-top: 64px;
      }
    }
  }

  .right-part {
    background-image: url(${loginIllustration});
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
  }
`;
