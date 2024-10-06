import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Base URL for API requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Enable credentials for cross-origin requests
api.defaults.withCredentials = true;

// Request interceptor
api.interceptors.request.use(
  function (config) {
    // Uncomment and modify the following lines if you want to add an authorization token
    // const token = Cookies.get("accessToken");
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  function (error) {
    // Handle request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  function (response) {
    // Return only the data part of the response
    return response.data;
  },
  function (error) {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Uncomment and modify the following lines to handle token refreshing
        // const newAccessToken = await refreshAccessToken();
        // axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        // originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
      
      // Handle other status codes if necessary
      if (error.response.status === 403) {
        // Handle forbidden access
        console.error("Access forbidden:", error.response.data);
      }
    } else {
      console.error("Network error:", error);
    }

    // Reject the promise with the error
    return Promise.reject(error);
  }
);

export default api;
