import { useState } from 'react';
import { Redirect } from 'wouter';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Container } from '~/components/Container';
import { Link } from '~/components/Link';

export function DeleteAccount() {
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  async function deleteAccount() {
    setLoading(true);

    const result = await server.users['delete-account'].delete();

    if (result) {
      setLoading(false);
    }

    if (result.error) {
      setLoading(false);
      return;
    }
    setShouldRedirect(true);
  }

  if (shouldRedirect) {
    return <Redirect to={to('/login')} />;
  }

  return (
    <Container>
      <h1>Delete Account</h1>
      <p>Deleting your account is permanent.</p>
      <p>
        All of your recipes and stored data will be permanently deleted and
        unable to be recovered.
      </p>
      <p>To confirm, type "DELETE" below.</p>
      <input
        type="text"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        placeholder="Type DELETE"
      />
      <ButtonGroup>
        <Button
          disabled={confirmation === 'DELETE'}
          onClick={() => {
            void deleteAccount();
          }}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </Button>

        <Link to={to('/settings')}>Cancel</Link>
      </ButtonGroup>
    </Container>
  );
}
