import { adminApiClient } from './adminClient';
import type { AuthResponse, AdminUser } from '../../../shared/types/api';

interface LoginPayload {
  email: string;
  password: string;
  deviceName?: string;
}

export const loginAdmin = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await adminApiClient.post('/admin/v1/auth/login', payload);
  return data;
};

export const getAdminSession = async (): Promise<AdminUser> => {
  const { data } = await adminApiClient.get('/admin/v1/auth/me');
  return data;
};

export const logoutAdmin = async () => {
  await adminApiClient.post('/admin/v1/auth/logout');
};
