import { EmailAddress } from '@recipe-app/common';
import { AccountCreationAttempt } from './AccountCreationAttempt';
import { VerifyEmailAddress } from './components/VerifyEmailAddress';
import { EmailAlreadyVerified } from './EmailAlreadyVerified';
import { ResetPassword } from './ResetPassword';
import type { Email } from './schemas';
import {
  EmailChecker,
  EmailResponseErrorChecker,
  MailpitEmailErrorChecker,
  MailpitEmailResponseChecker,
} from './schemas';
import type { EmailData } from './types';

type EmailResponse =
  | {
      errorOccurred: true;
      data?: never;
    }
  | {
      errorOccurred?: never;
      data: unknown;
    };

export function sendEmail(env: Env, data: EmailData): Promise<EmailResponse> {
  switch (data.type) {
    case 'VerifyEmailAddress':
      return send(
        {
          from: EmailAddress['account'],
          recipients: [data.recipient],
          subject: 'Verify your email',
          html_content: VerifyEmailAddress.html(data),
          text_content: VerifyEmailAddress.text(data),
        },
        env,
      );

    case 'ResetPassword':
      return send(
        {
          from: EmailAddress['account'],
          recipients: [data.recipient],
          subject: 'Reset your password',
          html_content: ResetPassword.html(data),
          text_content: ResetPassword.text(data),
        },
        env,
      );

    case 'AccountCreationAttempt':
      return send(
        {
          from: EmailAddress['account'],
          recipients: [data.recipient],
          subject: 'You already have an account with us',
          html_content: AccountCreationAttempt.html(data),
          text_content: AccountCreationAttempt.text(data),
        },
        env,
      );

    case 'EmailAlreadyVerified':
      return send(
        {
          from: EmailAddress['account'],
          recipients: [data.recipient],
          subject: 'Your email address is already verified',
          html_content: EmailAlreadyVerified.html(data),
          text_content: EmailAlreadyVerified.text(data),
        },
        env,
      );
  }
}

async function send(email: Email, env: Env): Promise<EmailResponse> {
  if (!EmailChecker.Check(email)) {
    console.error(
      `Invalid email format ${JSON.stringify({
        captureContext: { extra: { email } },
      })}`,
    );
    return {
      errorOccurred: true,
    };
  }

  if (env.ENVIRONMENT !== 'production') {
    // We use Mailpit for testing emails
    const response = await fetch('http://localhost:8025/api/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        From: { Email: email.from.email },
        To: email.recipients.map((r) => ({ Email: r.email, Name: r.name })),
        Subject: email.subject,
        Text: email.text_content,
        HTML: email.html_content,
      }),
    });
    const data = await response.json();

    if (!response.ok && MailpitEmailErrorChecker.Check(data)) {
      console.error('Error from Mailpit', {
        captureContext: { extra: { data: JSON.stringify(data) } },
      });
      return {
        errorOccurred: true,
      };
    }

    if (MailpitEmailResponseChecker.Check(data)) {
      return {
        data,
      };
    }

    console.error('Invalid response format from Mailpit', {
      captureContext: { extra: { data: JSON.stringify(data) } },
    });
    return {
      errorOccurred: true,
    };
  }

  const response = await fetch(
    `https://api.ahasend.com/v2/accounts/${env.AHASEND_ACCOUNT_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AHASEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    },
  );
  const data = await response.json();

  if (!response.ok) {
    if (EmailResponseErrorChecker.Check(data)) {
      console.error('Error from AhaSend', {
        captureContext: {
          extra: {
            data: JSON.stringify(data),
            status: response.status,
            statusText: response.statusText,
          },
        },
      });
      return { errorOccurred: true };
    }

    console.error('Invalid response format from AhaSend', {
      captureContext: {
        extra: {
          data: JSON.stringify(data),
          status: response.status,
          statusText: response.statusText,
        },
      },
    });
    return { errorOccurred: true };
  }

  return { data };
}
