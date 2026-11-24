import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusease_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('campusease_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem('campusease_access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('campusease_access_token');
          localStorage.removeItem('campusease_refresh_token');
          localStorage.removeItem('campusease_user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
