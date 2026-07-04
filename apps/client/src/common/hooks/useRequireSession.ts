import { useEffect } from 'react';
import { useAuthenticated } from '~/common/data/users';
import { useClearAllDataAndRedirectToLogin } from '~/common/hooks/useClearAllDataAndRedirectToLogin';

/**
 * Redirect to the login page if there is no active session.
 */
export function useRequireSession(
  redirectionToAttemptedPathDisabled = false,
): boolean {
  const { data: authenticated, isLoading } = useAuthenticated();
  const clearAllDataAndRedirectToLogin = useClearAllDataAndRedirectToLogin();

  useEffect(() => {
    if (isLoading || authenticated) {
      return;
    }

    void clearAllDataAndRedirectToLogin(redirectionToAttemptedPathDisabled);
  }, [
    authenticated,
    clearAllDataAndRedirectToLogin,
    isLoading,
    redirectionToAttemptedPathDisabled,
  ]);

  return isLoading;
}
