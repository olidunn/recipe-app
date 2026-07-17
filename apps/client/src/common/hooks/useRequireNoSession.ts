import { to } from '@recipe-app/common';
import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuthenticated } from '~/common/data/users';

/**
 * Redirect to the home page if there is an active session.
 */
export function useRequireNoSession(): boolean {
  const loadedRef = useRef(false);
  const [, setLocation] = useLocation();
  const { data: authenticated, isLoading } = useAuthenticated();

  const getSession = useCallback(() => {
    loadedRef.current = true;

    if (authenticated && !isLoading) {
      setLocation(to('/'), { replace: true });
    }
  }, [setLocation, authenticated, isLoading]);

  useEffect(() => {
    if (!loadedRef.current) {
      getSession();
    }
  }, [getSession]);

  return isLoading;
}
