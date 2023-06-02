import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${config.offr_io_token}`
  }
});
axiosInstance.defaults.baseURL = config.offr_io_api;
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error?.response?.data || 'Internal server error';
  }
);

export default axiosInstance;
