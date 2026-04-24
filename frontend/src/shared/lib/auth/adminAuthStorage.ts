import type { AdminUser } from '../../types/api';

const ADMIN_AUTH_STORAGE_KEY = 'projeto_turismo_admin_auth';

interface StoredAdminAuth {
  token: string;
  user: AdminUser;
}

const isBrowser = typeof window !== 'undefined';

export const readStoredAdminAuth = (): StoredAdminAuth | null => {
  if (!isBrowser) {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as StoredAdminAuth;
  } catch {
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    return null;
  }
};

export const writeStoredAdminAuth = (auth: StoredAdminAuth) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearStoredAdminAuth = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
};
