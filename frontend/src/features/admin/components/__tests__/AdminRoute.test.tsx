import { QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAuthProvider } from '../../hooks/adminAuthContext';
import { AdminRoute } from '../AdminRoute';
import { clearAdminSession, setAdminSession } from '../../../../shared/lib/auth/adminSession';
import { createTestQueryClient } from '../../../../test/utils';

vi.mock('../../api/authApi', () => ({
  getAdminSession: vi.fn(async () => ({
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  })),
  loginAdmin: vi.fn(),
  logoutAdmin: vi.fn(),
}));

const validSession = {
  token: 'valid-token',
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  },
};

const renderAdminRoute = () => {
  const queryClient = createTestQueryClient();

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin']}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<div>Tela de login</div>} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>Painel admin</div>} />
        </Route>
      </Routes>
    </AdminAuthProvider>,
    { wrapper: Wrapper },
  );
};

describe('AdminRoute', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAdminSession();
  });

  it('redirects to login when the admin session is cleared', async () => {
    setAdminSession(validSession);

    renderAdminRoute();

    await screen.findByText('Painel admin');

    await act(async () => {
      clearAdminSession();
    });

    await waitFor(() => {
      expect(screen.getByText('Tela de login')).toBeInTheDocument();
    });
  });
});
