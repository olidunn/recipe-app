import { CreateUserRequest, validateNewPassword } from '@recipe-app/common';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { paths } from '~/common/routes';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { Button } from '~/components/Button';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';

export function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorByName, setErrorByName] = useState<ErrorByName<
    typeof CreateUserRequest
  > | null>(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [, setLocation] = useLocation();

  async function createAccount() {
    try {
      setErrorByName(null);

      const errorMessage = validateNewPassword(password, confirmedPassword);
      if (errorMessage) {
        setErrorByName({ password: { message: errorMessage } });
        return;
      }

      const body = {
        name,
        email,
        password,
        confirmedPassword,
      };
      const result = validate(body, CreateUserRequest);
      if (result.failed) {
        setErrorByName(result.errorByName);
        return;
      }

      setCreatingAccount(true);
      const { error } = await server.users['create-account'].post(body);
      if (error) {
        throw error;
      }

      setLocation(paths.home);
    } catch (_error) {
      // Display a "Something went wrong" message: 'We were unable to create your account.'
    } finally {
      setCreatingAccount(false);
    }
  }

  return (
    <Form>
      <InputText
        label="Name"
        onChange={(event) => setName(event.target.value)}
        value={name}
        error={errorByName?.name?.message}
      />
      <InputText
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        error={errorByName?.email?.message}
      />
      <InputText
        label="Password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        error={errorByName?.password?.message}
      />
      <InputText
        label="Confirm password"
        onChange={(event) => setConfirmedPassword(event.target.value)}
        value={confirmedPassword}
        error={errorByName?.confirmedPassword?.message}
      />
      <Button
        style={{
          marginLeft: 'auto',
        }}
        onClick={createAccount}
      >
        {creatingAccount ? 'loading...' : 'Create account'}
      </Button>
    </Form>
  );
}
