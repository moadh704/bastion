import axios from 'axios';
import router from '../router';

const configured = import.meta.env.VITE_API_URL || '';
const useSameOrigin = !configured || configured.includes('railway.app') || configured.includes('localhost');
const api = axios.create({
  baseURL: useSameOrigin
    ? (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api')
    : configured,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;