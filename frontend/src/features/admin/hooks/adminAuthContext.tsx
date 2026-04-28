import {
  useEffect,
  useMemo,
  type PropsWithChildren,
  useState,
} from 'react';
import { getApiErrorMessage } from '../../../shared/lib/api/getApiErrorMessage';
import {
  clearAdminSession,
  restoreAdminSession,
  setAdminSession,
  subscribeToAdminSession,
  type AdminSession,
} from '../../../shared/lib/auth/adminSession';
import { getAdminSession as fetchAdminSession, loginAdmin, logoutAdmin } from '../api/authApi';
import { AdminAuthContext, type AdminAuthContextValue } from './adminAuthContextValue';

export const AdminAuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<AdminSession | null>(() => restoreAdminSession());
  const [isInitializing, setIsInitializing] = useState(Boolean(session?.token));

  useEffect(() => subscribeToAdminSession((nextSession) => {
    setSession(nextSession);

    if (!nextSession?.token) {
      setIsInitializing(false);
    }
  }), []);

  useEffect(() => {
    if (!session?.token) {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;
    setIsInitializing(true);

    fetchAdminSession()
      .then((sessionUser) => {
        if (!isMounted) {
          return;
        }

        setAdminSession({ token: session.token, user: sessionUser });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearAdminSession();
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [session?.token]);

  const token = session?.token ?? null;
  const user = session?.user ?? null;

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

          setAdminSession({ token: response.token, user: response.user });
        } catch (error) {
          throw new Error(getApiErrorMessage(error, 'Falha ao autenticar administrador.'));
        }
      },
      logout: async () => {
        try {
          await logoutAdmin();
        } finally {
          clearAdminSession();
        }
      },
    }),
    [isInitializing, token, user],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
