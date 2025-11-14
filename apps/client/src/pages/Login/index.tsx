import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { authenticatedKey } from '~/common/data/users';
import { to } from '~/common/paths';
import { server } from '~/common/server';
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
  const queryClient = useQueryClient();

  async function login() {
    try {
      setErrorMessage('');
      setLoggingIn(true);
      const { error } = await server.users.login.post({
        email,
        password,
      });

      if (error?.status === 400) {
        setErrorMessage(error.value);
        return;
      }

      if (error) {
        throw error;
      }

      queryClient.setQueryData(authenticatedKey, true);
      setLocation(to('/'), { replace: true });
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
        label="Email"
        type="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        autoComplete="email"
      />
      <InputText
        label="Password"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        errorMessage={errorMessage}
        autoComplete="current-password"
      />

      <ButtonGroup>
        <StyledLink to={to('/create-account')}>Create Account</StyledLink>

        <Button
          style={{
            marginLeft: 'auto',
          }}
          onClick={login}
          loading={loggingIn}
        >
          Login
        </Button>
      </ButtonGroup>
    </Form>
  );
}
