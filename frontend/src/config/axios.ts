import axios from "axios";
import Cookies from "js-cookie";
// Set config defaults when creating the instance
const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BE,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Cookies.get("accessToken")}`,
  },
});

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
api.defaults.withCredentials = true;

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default api;
