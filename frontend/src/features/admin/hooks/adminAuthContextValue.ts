import { createContext } from 'react';
import type { AdminUser } from '../../../shared/types/api';

interface LoginValues {
  email: string;
  password: string;
}

export interface AdminAuthContextValue {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (values: LoginValues) => Promise<void>;
  logout: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
