import type {
  DefaultError,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { server } from '~/common/server';

export const authenticatedKey = ['authenticated'];

export function useAuthenticated() {
  return useQuery({
    queryKey: authenticatedKey,
    queryFn: async () => {
      const { data: authenticated } = await server.users.authenticated.get();
      return !!authenticated;
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
  });
}

/**
 * A wrapper around useQuery that only enables the query when the user is authenticated.
 */
export function useAuthenticatedQuery<TData = unknown, TError = DefaultError>(
  options: UseQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
  const { data: authenticated } = useAuthenticated();

  return useQuery({
    ...options,
    enabled: !!authenticated && (options.enabled ?? true),
  });
}
