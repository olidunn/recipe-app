import { to } from '@recipe-app/common';
import { useState } from 'react';
import { useParams } from 'wouter';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Link } from '~/components/Link';
import { ResendVerificationEmailForm } from './ResendVerificationEmailForm';

export function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [verified, setVerified] = useState<boolean | null>(null);

  async function verifyEmail(): Promise<void> {
    try {
      const response = await server.users['verify-email']({ token }).post();

      setVerified(!!response.data?.emailIsVerified);
    } catch {
      setVerified(false);
    }
  }

  if (verified === null) {
    return (
      <Container>
        <p>Please click the button to verify</p>
        <Button
          onClick={() => {
            void verifyEmail();
          }}
        >
          Verify Email
        </Button>
      </Container>
    );
  }

  return (
    <div>
      {verified ? (
        <>
          <h1>Email Verified!</h1>
          <p>Your email has been successfully verified.</p>
          <Link to={to('/login')}>Log In</Link>
        </>
      ) : (
        <>
          <h1>Verification Failed</h1>
          <p>This verification link is invalid or has expired.</p>
          <p>
            Your email address could not be verified. Please fill in the form
            below to try again.
          </p>
          <ResendVerificationEmailForm />
        </>
      )}
    </div>
  );
}
