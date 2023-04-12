import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';

import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/user';
import { useUI } from '../context/ui';
import { login } from '../actions/user';
import { startLoading, stopLoading } from '../actions/ui';
const Login = () => {
  const navigate = useNavigate();
  const userContext = useUser();
  const UIContext = useUI();
  if (!userContext || !UIContext) return null;

  const [state, setState] = useState({
    email: '',
    password: '',
    rememberMe: false,
    emailError: false,
    passwordError: false,
    errorMessage: ''
  });

  useEffect(() => {
    if (userContext) {
      setState((prev) => ({
        ...prev,
        rememberMe: userContext.state.rememberMe
      }));
    }
  }, []);

  const handleLogin = async () => {
    setState((prev) => ({
      ...prev,
      errorMessage: '',
      emailError: false,
      passwordError: false
    }));

    if (!state.email) setState((prev) => ({ ...prev, emailError: true }));
    if (!state.password) setState((prev) => ({ ...prev, passwordError: true }));
    if (!state.email || !state.password) {
      return;
    }

    startLoading(UIContext)();
    const success = await login(userContext)(
      state.email.toString(),
      state.password.toString(),
      state.rememberMe
    );
    stopLoading(UIContext)();
    if (success) {
      navigate('/');
    } else {
      setState((prev) => ({
        ...prev,
        emailError: true,
        errorMessage: 'Email or password is incorrect'
      }));
    }
  };

  return (
    <>
      {UIContext.state.isLoading ? (
        <Box sx={{ width: '100%', position: 'absolute', top: '0' }}>
          <LinearProgress />
        </Box>
      ) : null}
      <Container
        component='main'
        maxWidth='xs'
        sx={{
          paddingTop: { xs: 0, sm: '5%' }
        }}>
        <Box>
          <Box sx={{ textAlign: 'center' }}>LOGO</Box>
          <Box
            sx={{
              background: '#F3F5F9',
              p: { xs: '20px', sm: '40px', md: '70px' },
              borderRadius: '5px'
            }}>
            <Box>
              <Typography
                variant='h4'
                sx={
                  {
                    // textAlign: "left",
                    // font: "normal normal bold 30px/36px Helvetica",
                    // letterSpacing: "1.5px",
                    // color: "#393A40",
                  }
                }>
                Welcome!
              </Typography>

              <Box sx={{ pl: 0, pt: 4, pb: 3, pr: 0 }}>
                <Typography variant='body1'>Conecteaza-te pentru a continua</Typography>
              </Box>
              <Box>
                <TextField
                  required={true}
                  fullWidth={true}
                  onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
                  label='Adresa de e-mail'
                  variant='standard'
                  error={state.emailError}
                  helperText={state.errorMessage}
                  onChangeCapture={() => setState((prev) => ({ ...prev, emailError: false }))}
                />
              </Box>
              <Box sx={{ pt: 1 }}>
                <TextField
                  required={true}
                  fullWidth={true}
                  onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
                  label='Parola'
                  variant='standard'
                  type='password'
                  error={state.passwordError}
                  onChangeCapture={() => setState((prev) => ({ ...prev, passwordError: false }))}
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      size='small'
                      checked={state.rememberMe}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          rememberMe: !state.rememberMe
                        }))
                      }
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '13px', color: '#404040' }} variant='body2'>
                      Remember me
                    </Typography>
                  }
                />
              </Box>
              <Box>
                <Button
                  disabled={UIContext.state.isLoading}
                  onClick={handleLogin}
                  variant='contained'
                  color='primary'
                  fullWidth={true}>
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
