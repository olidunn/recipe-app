import type { QueryClientProviderProps } from '@tanstack/react-query';
import {
  QueryClient,
  QueryClientProvider as TanstackProvider,
} from '@tanstack/react-query';
import type { ReactElement } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Since this app is a single user experience, we don't benefit from refetching data on window focus.
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryClientProvider({
  children,
}: Omit<QueryClientProviderProps, 'client'>): ReactElement {
  return <TanstackProvider client={queryClient}>{children}</TanstackProvider>;
}
