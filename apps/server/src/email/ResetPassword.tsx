import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AccessAttemptMessage } from './components/AccessAttemptMessage';
import type { ResetPasswordData } from './types';

function Component({
  recipient: { name },
  link,
}: ResetPasswordData): ReactElement {
  return (
    <div>
      <p>Hey {name},</p>
      <p>It looks like you've requested a password reset.</p>
      <p>Please click the link below to choose a new password:</p>
      <a href={link}>Reset your password</a>
      <AccessAttemptMessage />
    </div>
  );
}

function text({ recipient: { name }, link }: ResetPasswordData): string {
  return `
Hey ${name},

It looks like you've requested a password reset.

Please open the link below to choose a new password:
${link}

${AccessAttemptMessage}
`;
}

export const ResetPassword = {
  html: (data: ResetPasswordData) => renderToString(<Component {...data} />),
  text: (data: ResetPasswordData) => text(data),
};
