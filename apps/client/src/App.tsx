import { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  Link as WouterLink,
} from 'wouter';
import { useAuthenticated } from '~/common/data/users';
import { paths, to } from './common/paths';
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
  const [navMenuIsOpen, setNavMenuIsOpen] = useState(false);

  async function logout() {
    try {
      setLoggingOut(true);
      const { error } = await server.users.logout.post();

      if (error) {
        throw error;
      }

      setLocation(to('/login'));
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
              <WouterLink
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  fontSize: '18px',
                }}
                to={to('/')}
              >
                Recipe App
              </WouterLink>
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
          <Route path={paths.home} component={HomeRedirection} />
          <Route path={paths.recipes} component={Recipes} />
          <Route path={paths.createRecipe} component={CreateRecipe} />
          <Route path={paths.recipe} component={RecipePage} />
          <Route path={paths.updateRecipe} component={UpdateRecipe} />
          <Route path={paths.createAccount} component={CreateAccount} />
          <Route path={paths.login} component={Login} />
          <Route path={paths.verifyEmail} component={VerifyEmail} />
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
