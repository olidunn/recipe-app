import { emailAddress } from '@recipe-app/common';
import type { ReactElement } from 'react';

export function ContactSupport(): ReactElement {
  return <a href={`mailto:${emailAddress.support.email}`}>contact support</a>;
}

export const contactSupport = `contact support at ${emailAddress.support.email}`;
