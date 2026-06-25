import { env } from 'elysia';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AccessAttemptMessage } from '../components/AccessAttemptMessage';
import type { EmailAlreadyVerifiedData } from '../types';

function Component({
  recipient: { name },
}: EmailAlreadyVerifiedData): ReactElement {
  return (
    <div>
      <p>Hey {name},</p>
      <p>
        It looks like you tried verifying your email address, but it's already
        verified! 🫵
      </p>
      <p>
        You can <a href={`${env.CLIENT_URL}/login`}>login here</a>.
      </p>
      <p>
        Forgot your password? No problem, you can{' '}
        <a href={`${env.CLIENT_URL}/forgot-password`}>reset it here</a>.
      </p>
      <hr />
      <AccessAttemptMessage />
    </div>
  );
}

function text({ recipient: { name } }: EmailAlreadyVerifiedData): string {
  return `
Hey ${name},

It looks like you tried verifying your email address, but it's already verified! 🫤

You can login here: ${env.CLIENT_URL}/login

Forgot your password? No problem, you can reset it here: ${env.CLIENT_URL}/forgot-password

--------------------------------------------

${AccessAttemptMessage}`;
}

export const EmailAlreadyVerified = {
  html: (data: EmailAlreadyVerifiedData) =>
    renderToString(<Component {...data} />),
  text: (data: EmailAlreadyVerifiedData) => text(data),
};
