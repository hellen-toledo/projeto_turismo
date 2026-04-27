import { apiClient } from '../../../shared/lib/api/client';
import { apiPaths } from '../../../shared/lib/api/config';
import type { AuthResponse, AdminUser } from '../../../shared/types/api';

interface LoginPayload {
  email: string;
  password: string;
  deviceName?: string;
}

export const loginAdmin = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await apiClient.post(apiPaths.admin.auth.login, payload);
  return data;
};

export const getAdminSession = async (): Promise<AdminUser> => {
  const { data } = await apiClient.get(apiPaths.admin.auth.me);
  return data;
};

export const logoutAdmin = async () => {
  await apiClient.post(apiPaths.admin.auth.logout);
};
