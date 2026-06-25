import { env } from 'elysia';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AccessAttemptMessage } from './components/AccessAttemptMessage';
import type { AccountCreationAttemptData } from './types';

function Component({
  recipient: { name },
}: AccountCreationAttemptData): ReactElement {
  return (
    <div>
      <p>Hey {name},</p>
      <p>
        It looks like you tried creating an account, but you already have one!
        🍌
      </p>
      <p>
        Forgot your password? No problem, you can{' '}
        <a href={`${env.CLIENT_URL}/forgot-password`}>reset it here</a>.
      </p>
      <p>
        You can <a href={`${env.CLIENT_URL}/login`}>login here</a>.
      </p>
      <hr />
      <AccessAttemptMessage />
    </div>
  );
}

function text({ recipient: { name } }: AccountCreationAttemptData): string {
  return `
Hey ${name},

It looks like you tried creating an account, but you already have one! 😂

Forgot your password? No problem, you can reset it here: ${env.CLIENT_URL}/forgot-password

You can login here: ${env.CLIENT_URL}/login

--------------------------------------------

${AccessAttemptMessage}`;
}

export const AccountCreationAttempt = {
  html: (data: AccountCreationAttemptData) =>
    renderToString(<Component {...data} />),
  text: (data: AccountCreationAttemptData) => text(data),
};
