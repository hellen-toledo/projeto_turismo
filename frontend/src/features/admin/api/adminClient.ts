import axios from 'axios';
import { readStoredAdminAuth } from '../../../shared/lib/auth/adminAuthStorage';

export const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

adminApiClient.interceptors.request.use((config) => {
  const auth = readStoredAdminAuth();

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});
