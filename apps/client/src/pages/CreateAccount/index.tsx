import { useState } from 'react';
import { useLocation } from 'wouter';
import { paths } from '~/common/routes';
import { Button } from '~/components/Button';
import { Form } from '~/components/Form';
import { InputText } from '~/components/InputText';

export function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [, setLocation] = useLocation();

  async function createAccount() {
    try {
      setErrorMessage('');
      setCreatingAccount(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/create-account`,
        {
          body: JSON.stringify({ name, email, password, confirmPassword }),
          method: 'POST',
        },
      );

      if (response.status === 400) {
        setErrorMessage(await response.text());
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
        id="name"
        label="Name"
        onChange={(event) => setName(event.target.value)}
        value={name}
      />
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
      <InputText
        id="confirmPassword"
        label="Confirm password"
        onChange={(event) => setConfirmPassword(event.target.value)}
        value={confirmPassword}
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
