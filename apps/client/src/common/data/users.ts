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
