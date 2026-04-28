import axios from 'axios';
import { clearAdminSession, getAdminAccessToken } from '../auth/adminSession';
import { API_BASE_URL } from './config';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const isAdminApiRequest = (url?: string) => {
  if (!url) {
    return false;
  }

  if (url.startsWith('/admin') || url.startsWith('admin/')) {
    return true;
  }

  try {
    return new URL(url, API_BASE_URL).pathname.startsWith('/api/v1/admin');
  } catch {
    return url.includes('/admin/');
  }
};

export const shouldClearAdminSessionForError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  return (status === 401 || status === 403) && isAdminApiRequest(error.config?.url);
};

export const rejectWithAdminSessionCleanup = (error: unknown) => {
  if (shouldClearAdminSessionForError(error)) {
    clearAdminSession();
  }

  return Promise.reject(error);
};

apiClient.interceptors.request.use((config) => {
  const token = getAdminAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use((response) => response, rejectWithAdminSessionCleanup);
