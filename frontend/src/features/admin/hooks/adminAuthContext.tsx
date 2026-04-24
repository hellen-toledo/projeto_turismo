import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { AdminUser } from '../../../shared/types/api';
import { clearStoredAdminAuth, readStoredAdminAuth, writeStoredAdminAuth } from '../../../shared/lib/auth/adminAuthStorage';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import { getAdminSession, loginAdmin, logoutAdmin } from '../api/authApi';
import { AdminAuthContext, type AdminAuthContextValue } from './adminAuthContextValue';

export const AdminAuthProvider = ({ children }: PropsWithChildren) => {
  const storedAuth = readStoredAdminAuth();
  const [token, setToken] = useState<string | null>(storedAuth?.token ?? null);
  const [user, setUser] = useState<AdminUser | null>(storedAuth?.user ?? null);
  const [isInitializing, setIsInitializing] = useState(Boolean(storedAuth?.token));

  useEffect(() => {
    if (!storedAuth?.token) {
      return;
    }

    let isMounted = true;

    getAdminSession()
      .then((sessionUser) => {
        if (!isMounted) {
          return;
        }

        setUser(sessionUser);
        writeStoredAdminAuth({ token: storedAuth.token, user: sessionUser });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearStoredAdminAuth();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storedAuth?.token]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login: async ({ email, password }) => {
        try {
          const response = await loginAdmin({
            email,
            password,
            deviceName: 'frontend-admin',
          });

          setToken(response.token);
          setUser(response.user);
          writeStoredAdminAuth({ token: response.token, user: response.user });
        } catch (error) {
          throw new Error(getApiErrorMessage(error, 'Falha ao autenticar administrador.'));
        }
      },
      logout: async () => {
        try {
          await logoutAdmin();
        } finally {
          clearStoredAdminAuth();
          setToken(null);
          setUser(null);
        }
      },
    }),
    [isInitializing, token, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
