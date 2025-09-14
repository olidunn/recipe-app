import { useState } from 'react';
import { useLocation } from 'wouter';
import { paths } from '~/common/routes';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';

export function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [, setLocation] = useLocation();

  async function createAccount() {
    try {
      setErrorMessage('');
      setCreatingAccount(true);
      const { error } = await server.users['create-account'].post({
        name,
        email,
        password,
        confirmedPassword,
      });

      if (error?.status === 400) {
        setErrorMessage(error.value);
        return;
      }

      setLocation(paths.home);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('We were unable to create your account.');
      }
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
      />
      <InputText
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
      />
      <InputText
        label="Password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        error={errorMessage}
      />
      <InputText
        label="Confirm password"
        onChange={(event) => setConfirmedPassword(event.target.value)}
        value={confirmedPassword}
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
