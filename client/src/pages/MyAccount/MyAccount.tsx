import { styled } from '@mui/system';
import { HTMLProps } from 'react';
import { Typography } from '../../components/Typography';
import { Header } from '../HomeLoggedIn/Header';
import { Button } from '../../components/Button';
import request from '../../utils/axios';
import { useGlobalState } from '../../globalState';
import { useNavigate } from 'react-router-dom';

export const MyAccount = styled(({ className }: HTMLProps<HTMLDivElement>) => {
  const {
    user: [user, setUser]
  } = useGlobalState();

  const navigate = useNavigate();

  const logOut = async () => {
    try {
      await request(user.auth.access_token).post('/api/account/logout', {
        refresh_token: user.auth.refresh_token
      });
    } catch (err) {
    } finally {
      setUser((user: any) => ({ ...user, auth: null }));
      navigate('/');
    }
  };

  return (
    <div className={`my-account-page ${className}`}>
      <Header />
      <div className='container'>
        <div className='left-menu'>
          <Button onClick={logOut} className='log-out-button'>
            Sign out
          </Button>
        </div>
        <div className='line'></div>
        <div>
          <Typography>My Account</Typography>
        </div>
      </div>
    </div>
  );
})`
  &.my-account-page {
    position: relative;
    min-height: 100vh;
    display: grid;
    background-color: white;

    grid-template-rows: min-content auto;

    .container {
      display: grid;
      column-gap: 69px;
      padding: 36px;

      grid-template-columns: 1fr min-content 2.79fr;

      .left-menu {
        display: grid;
        .log-out-button {
          align-self: flex-end;
        }
      }

      .line {
        width: 2px;
        background-color: #f3f4f5;
      }
    }
  }
`;
