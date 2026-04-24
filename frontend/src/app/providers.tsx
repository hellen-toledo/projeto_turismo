import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { AdminAuthProvider } from '../features/admin/hooks/adminAuthContext';
import { queryClient } from '../shared/lib/queryClient';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </QueryClientProvider>
  );
};
