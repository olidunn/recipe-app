/**
 * Enforces that at least one of `label` or `ariaLabel` is provided.
 */
export type RequiredAriaLabelProps =
  | {
      label: string;
      ariaLabel?: string | undefined;
    }
  | {
      label?: string | undefined;
      ariaLabel: string;
    };
