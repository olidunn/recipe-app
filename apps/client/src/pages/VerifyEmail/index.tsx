import { useState } from 'react';
import { useParams } from 'wouter';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Link } from '~/components/Link';

export function VerifyPage() {
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
            verifyEmail();
          }}
        >
          Verify Email
        </Button>
      </Container>
    );
  }

  return (
    <Container>
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
        </>
      )}
    </Container>
  );
}
