import type { ReactElement } from 'react';

type ValidationErrorProps = {
  message: string;
  /**
   * Should match the `aria-errormessage` value on the Input
   */
  id: string;
};

export function ValidationError({
  message,
  id,
}: ValidationErrorProps): ReactElement {
  return (
    <div
      id={id}
      data-testid={id}
      aria-live="polite"
      style={{
        color: 'red',
        marginTop: '4px',
        fontSize: '14px',
      }}
    >
      {message}
    </div>
  );
}
