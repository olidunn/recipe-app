import {
  CreateUserRequestSchema,
  to,
  validateNewPassword,
} from '@recipe-app/common';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { Button } from '~/components/Button';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';

const CreateUserRequestChecker = TypeCompiler.Compile(CreateUserRequestSchema);

export function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorByName, setErrorByName] = useState<ErrorByName<
    typeof CreateUserRequestSchema
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
      const result = validate(body, CreateUserRequestChecker);
      if (result.failed) {
        setErrorByName(result.errorByName);
        return;
      }

      setCreatingAccount(true);
      const { error } = await server.users['create-account'].post(body);
      if (error) {
        throw error;
      }

      setLocation(to('/'));
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
        errorMessage={errorByName?.name?.message}
        autoComplete="name"
      />
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
        autoComplete="new-password"
      />
      <InputText
        label="Confirm password"
        type="password"
        onChange={(event) => setConfirmedPassword(event.target.value)}
        value={confirmedPassword}
        errorMessage={errorByName?.confirmedPassword?.message}
      />
      <Button
        style={{
          marginLeft: 'auto',
        }}
        onClick={createAccount}
        loading={creatingAccount}
      >
        Create account
      </Button>
    </Form>
  );
}
