import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { VerifyEmailAddressData } from '../types';

function Component({
  recipient: { name },
  link,
}: VerifyEmailAddressData): ReactElement {
  return (
    <div>
      <p>Hey {name}!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href={link}>Verify your email address</a>
    </div>
  );
}

function text({ recipient: { name }, link }: VerifyEmailAddressData): string {
  return `
Hey ${name},

Please open the link below to verify your email address:
${link}`;
}

export const VerifyEmailAddress = {
  html: (data: VerifyEmailAddressData) =>
    renderToString(<Component {...data} />),
  text: (data: VerifyEmailAddressData) => text(data),
};
