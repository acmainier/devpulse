import axios from "axios";

// Shared axios instance with baseURL + interceptors set up once
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the saved token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If any request comes back 401, the token is bad — log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error); // still let the component handle it too
  },
);

export default api;
