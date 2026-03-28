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

/**
 * Props of inner components whose props are composed of `RequiredAriaLabelProps`.
 */
export type InnerRequiredAriaLabelProps<T> = Required<T> & {
  label: ReactNode | undefined;
  ariaLabel: string | undefined;
};

/**
 * To be used with inner components whose props are composed of `InnerRequiredAriaLabelProps`.
 */
export function getAriaLabel(
  label: ReactNode | undefined,
  ariaLabel: string | undefined,
): string {
  return (
    ariaLabel ??
    // We're already that ariaLabel is required when label is not of type string.
    (label as string)
  );
}
