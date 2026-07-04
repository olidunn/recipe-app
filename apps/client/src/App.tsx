import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Redirect, Switch, useLocation } from 'wouter';
import { useAuthenticated } from '~/common/data/users';
import { clearAllData } from '~/common/hooks/useClearAllDataAndRedirectToLogin';
import { PrivateRoute } from '~/components/PrivateRoute';
import { PublicOnlyRoute } from '~/components/PublicOnlyRoute';
import { Route } from '~/components/Route';
import { to } from './common/paths';
import { server } from './common/server';
import { Button } from './components/Button';
import { IconButton } from './components/IconButton';
import { Link } from './components/Link';
import { Loading } from './components/Loading';
import { CreateAccount } from './pages/CreateAccount';
import { CreateRecipe } from './pages/CreateRecipe';
import { Login } from './pages/Login';
import { RecipePage } from './pages/Recipe';
import { Recipes } from './pages/Recipes';
import { UpdateRecipe } from './pages/UpdateRecipe';
import { VerifyEmail } from './pages/VerifyEmail';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    /* Turn off double tapping */
    touch-action: manipulation;
  }

  body {
    margin: 0;
    font-family: "DM Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }


  /* ul is a CSS selector, that targets ALL ul elements in the document */
  ul,
  ol {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    list-style-position: inside;
  }

  header {
    background-color: aliceblue;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
  }

  main {
    margin: 0;

    @media (min-width: 768px) {
      padding: 8px;
    }

     @media (min-width: 992px) {
      padding: 16px;
    }
  }
`;

const NavMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0px;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: end;
  background-color: aliceblue;
`;

const Nav = styled.nav`
  position: relative;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function App() {
  const { data: authenticated } = useAuthenticated();
  const [, setLocation] = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const [navMenuIsOpen, setNavMenuIsOpen] = useState(false);

  async function logout() {
    try {
      setLoggingOut(true);
      await queryClient.cancelQueries();
      const { error } = await server.users.logout.post();

      if (error) {
        throw error;
      }

      await clearAllData(queryClient);
      setLocation(to('/login'), { replace: true });
    } catch (_error) {
      // TODO handle with sonner
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <GlobalStyle />
      <header>
        <Nav>
          {authenticated && (
            <>
              <Link
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
                to={to('/')}
              >
                Recipe App
              </Link>
              <IconButton
                onClick={() => {
                  setNavMenuIsOpen((state) => !state);
                }}
                type="menu"
                ariaLabel="open menu"
              />

              {navMenuIsOpen && (
                <NavMenu>
                  <Button onClick={logout} icon="logout" loading={loggingOut}>
                    Log out
                  </Button>

                  <Link icon="password" to={to('/')}>
                    Change Password
                  </Link>
                </NavMenu>
              )}
            </>
          )}
        </Nav>
      </header>
      <main>
        <Switch>
          <Route path="/" component={HomeRedirection} />
          <PublicOnlyRoute path="/create-account" component={CreateAccount} />
          <PublicOnlyRoute path="/login" component={Login} />
          <PrivateRoute path="/recipes" component={Recipes} />
          <PrivateRoute path="/recipes/create" component={CreateRecipe} />
          <PrivateRoute path="/recipes/:recipeId" component={RecipePage} />
          <PrivateRoute
            path="/recipes/:recipeId/update"
            component={UpdateRecipe}
          />
          <Route path="/verify-email/:token" component={VerifyEmail} />
          <Route>404 Not found</Route>
        </Switch>
      </main>
    </>
  );
}

function HomeRedirection() {
  const { data: authenticated, isLoading } = useAuthenticated();

  if (isLoading) {
    return <Loading size={30} />;
  }

  return <Redirect to={authenticated ? to('/recipes') : to('/login')} />;
}
