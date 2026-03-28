import type { ReactNode } from 'react';

/**
 * Props for components that need to ensure that either a `label` or an `ariaLabel` is a `string`.
 */
export type RequiredAriaLabelProps =
  | {
      label?: ReactNode | undefined;
      ariaLabel: string;
    }
  | {
      label: string;
      ariaLabel?: string | undefined;
    };
