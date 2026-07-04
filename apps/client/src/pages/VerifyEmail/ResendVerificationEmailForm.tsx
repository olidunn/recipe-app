import { TypeCompiler } from '@sinclair/typebox/compiler';
import { t } from 'elysia';
import { useState } from 'react';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { Button } from '~/components/Button';
import { ContactSupport } from '~/components/ContactSupport';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';

const ResendVerificationEmailRequest = t.Object({
  email: t.String({ format: 'email' }),
});

const ResendVerificationEmailRequestChecker = TypeCompiler.Compile(
  ResendVerificationEmailRequest,
);

export function ResendVerificationEmailForm() {
  const [email, setEmail] = useState('');
  const [errorByName, setErrorByName] = useState<ErrorByName<
    typeof ResendVerificationEmailRequest
  > | null>(null);
  const [sending, setSending] = useState(false);

  async function resendVerificationEmail() {
    try {
      setErrorByName(null);

      const body = { email };

      const result = validate(body, ResendVerificationEmailRequestChecker);
      if (result.failed) {
        setErrorByName(result.errorByName);
        return;
      }

      setSending(true);

      const { error } =
        await server.users['resend-verification-email'].post(body);

      if (error) {
        throw error;
      }
    } catch (_error) {
      // Todo: Display a toast using sonner
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <p>
        Please check your inbox for a verification email. If you can't find it,
        please check your spam folder.
      </p>
      <p>
        If you are still experiencing issues, please <ContactSupport />.
      </p>
      <Form>
        <InputText
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          errorMessage={errorByName?.email?.message}
          autoComplete="email"
        />

        <Button
          style={{ marginLeft: 'auto' }}
          onClick={resendVerificationEmail}
          loading={sending}
        >
          Resend verification email
        </Button>
      </Form>
    </>
  );
}
