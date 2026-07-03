import type { StrictOverride } from '@recipe-app/common';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from 'wouter';
import { useRequireSession } from '~/common/hooks/useRequireSession';
import { Loading } from '~/components/Loading';
import type { RouteProps } from '~/components/Route';
import { Route } from '~/components/Route';

type PrivateRouteProps = StrictOverride<
  RouteProps,
  { component: ComponentType<RouteComponentProps> }
> & {
  /**
   * Don't redirect to the attempted path when logging in.
   * @default false
   */
  redirectionToAttemptedPathDisabled?: boolean;
};

function PrivateRouteComponent({
  component: Component,
  redirectionToAttemptedPathDisabled,
  ...props
}: {
  component: ComponentType<RouteComponentProps>;
  redirectionToAttemptedPathDisabled?: boolean;
} & RouteComponentProps) {
  const loading = useRequireSession(redirectionToAttemptedPathDisabled);

  if (loading) {
    return <Loading />;
  }

  return <Component {...props} />;
}

/**
 * For routes that require user authentication.
 * Automatically redirect to the login page when the user isn't authenticated.
 */
export function PrivateRoute({
  component,
  redirectionToAttemptedPathDisabled = false,
  path,
  ...routeProps
}: PrivateRouteProps) {
  return (
    <Route
      {...routeProps}
      component={(props) => (
        <PrivateRouteComponent
          component={component}
          redirectionToAttemptedPathDisabled={
            redirectionToAttemptedPathDisabled
          }
          {...props}
        />
      )}
    />
  );
}
