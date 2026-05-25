import axios from "axios";
 
const axiosInstance = axios.create({
  baseURL:"https://www.societysmarthub.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
 
// Request interceptor — attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor — handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
 
export default axiosInstance;
 