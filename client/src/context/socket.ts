import io from 'socket.io-client';
import config from '../config';

// @ts-ignore
const socket = io(config.apiUrl, {
  auth: {
    token: sessionStorage.getItem('access_token')
  }
});

export default socket;
