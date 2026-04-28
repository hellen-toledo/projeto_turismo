import { beforeEach, describe, expect, it } from 'vitest';
import type { AdminSession } from '../adminSession';
import {
  clearAdminSession,
  getAdminSession,
  restoreAdminSession,
  setAdminSession,
} from '../adminSession';

const ADMIN_AUTH_STORAGE_KEY = 'projeto_turismo_admin_auth';

const validSession: AdminSession = {
  token: 'valid-token',
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  },
};

describe('adminSession', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAdminSession();
  });

  it('reads a valid session from storage', () => {
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(validSession));

    expect(restoreAdminSession()).toEqual(validSession);
    expect(getAdminSession()).toEqual(validSession);
  });

  it('removes an invalid stored session payload', () => {
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, '{"token":123}');

    expect(restoreAdminSession()).toBeNull();
    expect(getAdminSession()).toBeNull();
    expect(window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)).toBeNull();
  });

  it('clears the local session on logout', () => {
    setAdminSession(validSession);

    clearAdminSession();

    expect(getAdminSession()).toBeNull();
    expect(window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY)).toBeNull();
  });
});
