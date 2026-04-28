import type { AdminUser } from '../../types/api';

const ADMIN_AUTH_STORAGE_KEY = 'projeto_turismo_admin_auth';

export interface AdminSession {
  token: string;
  user: AdminUser;
}

type AdminSessionListener = (session: AdminSession | null) => void;

const isBrowser = typeof window !== 'undefined';
const listeners = new Set<AdminSessionListener>();

const isValidAdminUser = (value: unknown): value is AdminUser => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Partial<AdminUser>;

  return typeof user.id === 'number'
    && typeof user.name === 'string'
    && typeof user.email === 'string'
    && typeof user.isAdmin === 'boolean';
};

const isValidAdminSession = (value: unknown): value is AdminSession => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<AdminSession>;

  return typeof session.token === 'string'
    && session.token.length > 0
    && isValidAdminUser(session.user);
};

const emitAdminSession = (session: AdminSession | null) => {
  listeners.forEach((listener) => listener(session));
};

const removeStoredAdminSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
};

const persistAdminSession = (session: AdminSession | null) => {
  if (!isBrowser) {
    return;
  }

  if (!session) {
    removeStoredAdminSession();
    return;
  }

  window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(session));
};

const readStoredAdminSession = (): AdminSession | null => {
  if (!isBrowser) {
    return null;
  }

  const value = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);

  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!isValidAdminSession(parsed)) {
      removeStoredAdminSession();
      return null;
    }

    return parsed;
  } catch {
    removeStoredAdminSession();
    return null;
  }
};

let currentAdminSession = readStoredAdminSession();

export const restoreAdminSession = (): AdminSession | null => {
  currentAdminSession = readStoredAdminSession();
  emitAdminSession(currentAdminSession);

  return currentAdminSession;
};

export const getAdminSession = (): AdminSession | null => currentAdminSession;

export const getAdminAccessToken = (): string | null => currentAdminSession?.token ?? null;

export const setAdminSession = (session: AdminSession) => {
  currentAdminSession = session;
  persistAdminSession(session);
  emitAdminSession(currentAdminSession);
};

export const clearAdminSession = () => {
  const hadSession = currentAdminSession !== null || (
    isBrowser
    && window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) !== null
  );

  currentAdminSession = null;
  removeStoredAdminSession();

  if (hadSession) {
    emitAdminSession(currentAdminSession);
  }
};

export const subscribeToAdminSession = (listener: AdminSessionListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

// Temporary compromise:
// The current admin flow still uses a Bearer token persisted in localStorage so it
// works with the existing Sanctum API without broader backend/CORS changes.
// For a production-grade setup, prefer server-managed authentication with
// HttpOnly + SameSite + Secure cookies to reduce token exposure to XSS.
