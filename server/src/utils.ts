import axios from "axios";

export const config = {
  api: "https://demoapi.offr.io/v1",
  key: "563ce61fba5ae3fdcafd076bf3004f44",
};
const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Token ${config.key}`,
  },
});
axiosInstance.defaults.baseURL = config.api;
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error?.response?.data || "Internal server error";
  }
);

export default axiosInstance;
