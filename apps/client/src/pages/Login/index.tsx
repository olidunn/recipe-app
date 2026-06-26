import type { AuthenticationError } from '@recipe-app/common';
import { LoginRequest } from '@recipe-app/common';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { authenticatedKey } from '~/common/data/users';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';
import { Link } from '~/components/Link';

const LoginRequestChecker = TypeCompiler.Compile(LoginRequest);

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorByName, setErrorByName] = useState<ErrorByName<
    typeof LoginRequest
  > | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  async function login() {
    setErrorByName(null);
    const validation = validate({ email, password }, LoginRequestChecker);

    if (validation.failed) {
      return setErrorByName(validation.errorByName);
    }

    try {
      setLoggingIn(true);
      const { error } = await server.users.login.post({
        email,
        password,
      });

      if (error?.status === 400) {
        setErrorByName({
          password: { message: errorMessageByError[error.value] },
        });
        return;
      }

      if (error) {
        throw error;
      }

      queryClient.setQueryData(authenticatedKey, true);
      setLocation(to('/'), { replace: true });
    } catch (_) {
      setErrorByName({ password: { message: 'We were unable to login.' } });
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
        errorMessage={errorByName?.email?.message}
        autoComplete="email"
      />
      <InputText
        label="Password"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        errorMessage={errorByName?.password?.message}
        autoComplete="current-password"
      />

      <ButtonGroup>
        <Link to={to('/create-account')}>Create Account</Link>

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

const errorMessageByError: Record<AuthenticationError, string> = {
  emailIsNotVerified:
    'Your email has not been verified, please check your email.',
  invalidEmailOrPassword: 'Unable to login, please enter the correct details.',
};
