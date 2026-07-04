import type { ReactElement } from 'react';
import { ContactSupport, contactSupport } from './ContactSupport';

export function AccessAttemptMessage(): ReactElement {
  return (
    <>
      <p>If this wasn't you, you can safely ignore this email.</p>
      <p>
        If you have any questions, please <ContactSupport />.
      </p>
    </>
  );
}

export const accessAttemptMessage = `
If this wasn't you, you can safely ignore this email.
If you have any questions, please ${contactSupport}.
`;
