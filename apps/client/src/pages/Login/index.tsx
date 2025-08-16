import { useState } from 'react';
import { useLocation } from 'wouter';
import { paths } from '~/common/routes';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';
import { StyledLink } from '~/components/LinkStyle';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [, setLocation] = useLocation();

  async function login() {
    try {
      setErrorMessage('');
      setLoggingIn(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        body: JSON.stringify({ email, password }),
        method: 'POST',
      });

      const error = await response.text();

      if (response.status === 400) {
        setErrorMessage(error);
        return;
      }

      setLocation(paths.home);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('We were unable to login.');
      }
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <Form>
      <InputText
        id="email"
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
      />
      <InputText
        id="password"
        label="Password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        error={errorMessage}
      />

      <ButtonGroup>
        <StyledLink href={paths.createAccount}>Create Account</StyledLink>

        <Button
          style={{
            marginLeft: 'auto',
          }}
          onClick={login}
        >
          {loggingIn ? 'loading...' : 'Login'}
        </Button>
      </ButtonGroup>
    </Form>
  );
}
