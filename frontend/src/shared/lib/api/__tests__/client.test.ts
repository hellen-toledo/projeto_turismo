import axios, { AxiosError, AxiosHeaders } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearAdminSession, getAdminSession, setAdminSession } from '../../auth/adminSession';
import { rejectWithAdminSessionCleanup, shouldClearAdminSessionForError } from '../client';

const validSession = {
  token: 'valid-token',
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  },
};

const createAxiosError = (status: number, url: string) => new AxiosError(
  'Request failed',
  undefined,
  { url, headers: new AxiosHeaders() },
  undefined,
  {
    status,
    statusText: 'Error',
    headers: new AxiosHeaders(),
    config: { url, headers: new AxiosHeaders() },
    data: { message: 'Error' },
  },
);

describe('apiClient auth cleanup', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAdminSession();
  });

  it('marks 401 responses from admin endpoints for cleanup', () => {
    expect(shouldClearAdminSessionForError(createAxiosError(401, '/admin/auth/me'))).toBe(true);
  });

  it('marks 403 responses from admin endpoints for cleanup', () => {
    expect(shouldClearAdminSessionForError(createAxiosError(403, '/admin/cities'))).toBe(true);
  });

  it('does not clear the session for public endpoint errors', () => {
    expect(shouldClearAdminSessionForError(createAxiosError(401, '/cities'))).toBe(false);
  });

  it('cleans the admin session when an admin request returns 401 or 403', async () => {
    setAdminSession(validSession);

    await expect(rejectWithAdminSessionCleanup(createAxiosError(401, '/admin/events')))
      .rejects
      .toBeInstanceOf(axios.AxiosError);

    expect(getAdminSession()).toBeNull();
  });
});
