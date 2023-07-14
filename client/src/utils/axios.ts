import axios from 'axios';
import config from '../config';

const axiosWithToken = (token: string | null | undefined) => {
  const axiosInstance = axios.create({
    timeout: 30000
  });

  axiosInstance.defaults.baseURL = config.apiUrl;

  axiosInstance.interceptors.response.use((response: any) => response);

  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token ?? null;
  axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
  return axiosInstance;
};

export default axiosWithToken;
