import { to } from '@recipe-app/common';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

export function useClearAllDataAndRedirectToLogin(): (
  redirectionToAttemptedPathDisabled?: boolean,
) => Promise<void> {
  const [attemptedPath, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return async (redirectionToAttemptedPathDisabled = true) => {
    await clearAllData(queryClient);
    const path = redirectionToAttemptedPathDisabled
      ? to('/login')
      : `${to('/login')}?redirect=${encodeURIComponent(attemptedPath)}`;
    setLocation(path, { replace: true });
  };
}

export async function clearAllData(queryClient: QueryClient): Promise<void> {
  await queryClient.cancelQueries();
  queryClient.clear();
}
