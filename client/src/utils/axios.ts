import axios from 'axios';
import config from "../config";
const axiosInstance = axios.create({
    timeout: 30000
});

axiosInstance.defaults.baseURL = config.apiUrl;

axiosInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        throw error?.response?.data || 'Internal server error';
    }
);

axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token') ?? null
axiosInstance.defaults.headers.common['Content-Type'] =   'application/json'
export default axiosInstance;

