import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface RenderWithProvidersOptions {
  route?: string;
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  { queryClient = createTestQueryClient(), route = '/' }: RenderWithProvidersOptions = {},
) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  };
};

