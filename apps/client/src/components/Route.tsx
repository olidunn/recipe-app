import type { StrictOverride } from '@recipe-app/common';
import type { ReactElement } from 'react';
// biome-ignore lint/style/noRestrictedImports: the only place we should be importing Route from wouter
import type { RouteProps as WouterRouteProps } from 'wouter';
// biome-ignore lint/style/noRestrictedImports: the only place we should be importing Route from wouter
import { Route as WouterRoute } from 'wouter';
import type { Path } from '~/common/paths';

export type RouteProps = StrictOverride<WouterRouteProps, { path?: Path }>;

export function Route(props: RouteProps): ReactElement {
  return <WouterRoute {...props} />;
}
