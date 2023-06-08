import React from 'react';
import { styled } from '@mui/system';
import axios, { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { useGlobalState } from '../../globalState';
import { Backdrop } from '../../components/Backdrop';

export const VerifyAccount = styled(({ className = '' }: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    user: [user, setUser]
  } = useGlobalState();

  const [loading, setLoading] = React.useState(false);

  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${config.apiUrl}/api/account/invitation/${params.token}`);
        await verifyRegistration(response);
      } catch (err: AxiosError | any) {
        if (err?.response?.data?.message === 'user_not_found') {
          return navigate('/404');
        }
        throw err;
      }

      navigate('/');
    })();
  }, [params]);

  const verifyRegistration = async (response: any) => {
    setLoading(true);

    try {
      const userDetails = JSON.parse(window.atob(response.data.access_token.split('.')[1]));
      setUser((user: any) => ({ ...user, auth: response.data, userDetails }));
    } catch (err: AxiosError | any) {
      const message = err?.response?.data?.message;

      if (!message) throw err;

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`set-password ${className}`}>
      <Backdrop open={loading}></Backdrop>
    </div>
  );
})`
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f3edea 30.91%);
`;
