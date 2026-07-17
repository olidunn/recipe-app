import type { AuthenticationError } from '@recipe-app/common';
import { LoginRequestSchema, to } from '@recipe-app/common';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { authenticatedKey } from '~/common/data/users';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';
import { Link } from '~/components/Link';
import { ResendVerificationEmailForm } from '../VerifyEmail/ResendVerificationEmailForm';

const LoginRequestChecker = TypeCompiler.Compile(LoginRequestSchema);

export function Login() {
  const [emailIsNotVerified, setEmailIsNotVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorByName, setErrorByName] = useState<ErrorByName<
    typeof LoginRequestSchema
  > | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [, setLocation] = useLocation();
  const search = useSearch();
  const redirect = new URLSearchParams(search).get('redirect');
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
        if (error.value === 'emailIsNotVerified') {
          setEmailIsNotVerified(true);
        } else if (error.value === 'invalidEmailOrPassword') {
          setErrorByName({
            password: { message: errorMessageByError[error.value] },
          });
        }
        return;
      }

      if (error) {
        throw error;
      }

      const pathsToSkipRedirection: string[] = [to('/')];

      const path =
        redirect && !pathsToSkipRedirection.includes(redirect)
          ? redirect
          : to('/');

      setLocation(path, { replace: true });
      queryClient.setQueryData(authenticatedKey, true);
    } catch (_) {
      setErrorByName({ password: { message: 'We were unable to login.' } });
    } finally {
      setLoggingIn(false);
    }
  }

  if (emailIsNotVerified) {
    return (
      <>
        <h1>Almost there!</h1>
        <p>Your email needs to be verified before you can login.</p>
        <ResendVerificationEmailForm />
      </>
    );
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
