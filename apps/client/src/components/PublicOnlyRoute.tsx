import type { StrictOverride } from '@recipe-app/common';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from 'wouter';
import { useRequireNoSession } from '~/common/hooks/useRequireNoSession';
import { Loading } from '~/components/Loading';
import type { RouteProps } from '~/components/Route';
import { Route } from '~/components/Route';

type PublicOnlyRouteProps = StrictOverride<
  RouteProps,
  {
    component: ComponentType<RouteComponentProps>;
  }
>;

function PublicOnlyRouteComponent({
  component: Component,
  ...props
}: {
  component: ComponentType<RouteComponentProps>;
} & RouteComponentProps) {
  const loading = useRequireNoSession();

  if (loading) {
    return <Loading />;
  }

  return <Component {...props} />;
}

/**
 * For routes that should only be accessible to non-authenticated users.
 * Automatically redirect to home when the user is authenticated.
 */
export function PublicOnlyRoute({
  component,
  ...routeProps
}: PublicOnlyRouteProps) {
  return (
    <Route
      {...routeProps}
      component={(props) => (
        <PublicOnlyRouteComponent component={component} {...props} />
      )}
    />
  );
}
