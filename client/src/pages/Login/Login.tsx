import React from 'react';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildAbilityFor } from '../../utils/ability.util';
import { registerStore, useGlobalState } from '../../globalState';
import { unpackRules } from '@casl/ability/extra';
import { Typography } from '../../components/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Link } from '../../components/Link';
import { IconButton } from '../../components/IconButton';
import config from '../../config';
import { Backdrop } from '../../components/Backdrop';
import { Header } from './Header';
import loginIllustration from './loginIllustration.png';
import { LoginWithGoogle } from './components/LoginWithGoogle';
import { LoginWithFacebook } from './components/LoginWithFacebook';
import { LoginWithTwitter } from './components/LoginWithTwitter';
import axiosWithToken from '../../utils/axios';
import { useCookies } from 'react-cookie';

const schema = yup.object().shape({
  email: yup.string().email().required('email is required'),
  password: yup.string().min(6).max(32).required()
});

registerStore(
  'user',
  {
    rememberMe: false,
    auth: null,
    userDetails: null,
    ability: null
  },
  { persist: true }
);
export const decodeJWT = (accessToken: string) => JSON.parse(window.atob(accessToken.split('.')[1]));

export const Login = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm({ resolver: yupResolver(schema), mode: 'all' });

  const params = new URLSearchParams(useLocation().search);
  const validated = params.get('validated');
  const access_token = params.get('access_token');

  const [cookies, setCookie] = useCookies(['username', 'acceptCookies']);

  React.useEffect(() => {
    if (validated && access_token) {
      loginWithTwitter({ validated: Boolean(validated), access_token });
    }
  }, [validated, access_token]);

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    user: [user, setUser]
  } = useGlobalState();

  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!!user.auth) navigate('/');
  }, [user.auth]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    const { email, password } = data;

    try {
      const response = await axios.post(`${config.apiUrl}/api/account/login`, {
        email,
        password
      });

      const userDetails = decodeJWT(response.data.access_token);
      userDetails.rules = response.data.rules;

      const ability = buildAbilityFor(userDetails!.role, unpackRules(response.data.rules));

      const auth = response.data;

      setUser((user: any) => ({
        ...user,
        auth: {
          ...auth,
          expirationTime: Date.now() + auth.expires_in * 1000,
          refreshExpirationTime: Date.now() + auth.refresh_expires_in * 1000
        },
        userDetails,
        ability
      }));

      // if (Object(cookies).hasOwnProperty('acceptCookies') && cookies.acceptCookies === 'true') {
      //   setCookie('username', userDetails.username);
      // }
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      if (message === 'user_not_found') {
        return setError('email', { message: 'user not found!', type: 'server' });
      }

      if (message === 'incorrect_password') {
        return setError('password', { message: 'incorrect password', type: 'server' });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (response: { code: string }) => {
    try {
      const loginGoogleRes = await axios.post(`${config.apiUrl}/api/account/login-google`, {
        code: response.code
      });
      const userDetails = decodeJWT(loginGoogleRes.data.access_token);
      userDetails.rules = loginGoogleRes.data.rules;

      const ability = buildAbilityFor(userDetails!.role, unpackRules(loginGoogleRes.data.rules));

      const auth = loginGoogleRes.data;

      setUser((user: any) => ({
        ...user,
        auth: {
          ...auth,
          expirationTime: Date.now() + auth.expires_in * 1000,
          refreshExpirationTime: Date.now() + auth.refresh_expires_in * 1000
        },
        userDetails,
        ability
      }));
    } catch (err) {
      console.log(err);
      //handle error
    }
  };

  const loginWithTwitter = async (response: { access_token: string; validated: boolean }) => {
    try {
      if (response.validated) {
        const userDetails = decodeJWT(response.access_token);
        const getAuthData = await axiosWithToken(response.access_token).get('/api/account/get-access-tokens');

        const ability = buildAbilityFor(userDetails!.role, unpackRules(getAuthData.data.rules));
        const auth = getAuthData.data;

        setUser((user: any) => ({
          ...user,
          auth: {
            ...auth,
            expirationTime: Date.now() + auth.expires_in * 1000,
            refreshExpirationTime: Date.now() + auth.refresh_expires_in * 1000
          },
          userDetails,
          ability
        }));
      }
    } catch (err) {
      console.log(err);
      //handle error
    }
  };

  const handleFacebookLoginSuccess = async (accessToken: string) => {
    const response = await axios.post(`${config.apiUrl}/api/account/login-facebook`, { token: accessToken });
    const userDetails = decodeJWT(response.data.access_token);
    userDetails.rules = response.data.rules;

    const ability = buildAbilityFor(userDetails!.role, unpackRules(response.data.rules));

    const auth = response.data;

    setUser((user: any) => ({
      ...user,
      auth: {
        ...auth,
        expirationTime: Date.now() + auth.expires_in * 1000,
        refreshExpirationTime: Date.now() + auth.refresh_expires_in * 1000
      },
      userDetails,
      ability
    }));
  };

  const handleFacebookLoginFailure = (error: string) => {
    // Handle login failure
    console.error('Facebook login failed:', error);
    return setError('facebook', { message: 'Facebook login failed', type: 'client' });
  };

  return (
    <div className={`login-page ${className}`}>
      <Header />
      <Backdrop open={loading}></Backdrop>
      <div className='container'>
        <div className='left-part'>
          <Typography variant='body2' className='main-title'>
            Log in
          </Typography>

          <div className='dont-have-account'>
            <Typography variant='body4' className='new-to-lostfish'>
              New to Lostfish?
            </Typography>
            <Link variant='body4' onClick={() => navigate('/create-account')}>
              Create account
            </Link>
          </div>

          <div className='identity-providers'>
            <Button variant='secondary'>
              <Icon icon='apple' />
            </Button>

            <LoginWithFacebook
              appId={config.facebook.facebook_id}
              onLoginSuccess={handleFacebookLoginSuccess}
              onLoginFailure={handleFacebookLoginFailure}
              scope='email'
            />

            <LoginWithTwitter onSuccess={loginWithTwitter} />

            <LoginWithGoogle onSuccess={loginWithGoogle} />
          </div>

          <div className='or-line'>
            <span />
            <Typography variant='body5'>OR</Typography>
            <span />
          </div>

          <form className='content' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <TextField
                label='Email'
                className='email-input'
                required
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message?.toString()}
              />

              <TextField
                type={showPassword ? 'text' : 'password'}
                label='Password'
                className='password-input'
                required
                {...register('password')}
                endAdornment={
                  <IconButton
                    noBackground
                    style={{ color: '#184d6d' }}
                    onClick={() => setShowPassword((show) => !show)}>
                    {<Icon icon={showPassword ? 'eye' : 'eye-invisible'} />}
                  </IconButton>
                }
                error={!!errors.password}
                helperText={errors.password?.message?.toString()}
              />

              <Button className='login-button' type='submit' disabled={!isValid} size='large'>
                Sign in
              </Button>

              <div className='keep-me-signed-in-section'>
                <Typography variant='body4'>Forgot your password?</Typography>
                <Link variant='body4' onClick={() => navigate('/forgot-password')}>
                  Reset password
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className='right-part'></div>
      </div>
    </div>
  );
})`
  &.login-page {
    display: grid;
    min-height: 100vh;
    grid-template-rows: min-content auto;
    background-color: #ffffff;
  }

  .container {
    display: grid;
    grid-template-columns: 440px minmax(746px, 50%);
    justify-content: space-between;
    padding: 24px 36px 26px 36px;
  }

  .left-part {
    padding: 32px 24px 40px 36px;
    box-shadow: 0 4px 48px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    height: max-content;
    max-width: 440px;

    .main-title {
    }

    .dont-have-account {
      margin-top: 8px;
      display: flex;
      align-items: center;
      column-gap: 8px;

      .new-to-lostfish {
        color: #646464;
      }
    }

    .identity-providers {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
      .button {
        padding-inline: 28px;
        border-width: 2px;
      }
    }

    .or-line {
      display: grid;
      grid-template-columns: auto min-content auto;
      column-gap: 16px;
      align-items: center;
      margin-top: 24px;
      .typography {
        color: #a7a7a7;
      }

      span {
        height: 2px;
        background-color: #e7e7e7;
      }
    }

    .content {
      margin-top: 24px;

      .email-input {
      }

      .password-input {
        margin-top: 28px;
      }

      .keep-me-signed-in-section {
        margin-top: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        column-gap: 8px;
      }

      .login-button {
        margin-top: 36px;
        width: 100%;
      }
    }
  }

  .right-part {
    background-image: url(${loginIllustration});
    background-repeat: no-repeat;
    background-size: auto;
    background-color: white;
    background-position: center;
  }
`;
