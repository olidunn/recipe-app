import styled, { createGlobalStyle } from 'styled-components';
import { Route, Switch, useLocation } from 'wouter';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { CreateRecipe } from '~/components/RecipeForm';
import { paths } from './common/routes';
import { ButtonGroup } from './components/ButtonGroup';
import { StyledLink } from './components/LinkStyle';
import { CreateAccount } from './pages/CreateAccount';
import { Login } from './pages/Login';
import { RecipePage } from './pages/Recipe';
import { Recipes } from './pages/Recipes';

const GlobalStyle = createGlobalStyle`
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

  main {
    margin: 0 20px;

    @media (max-width: 1200px) {
      font-size: 30px;
      button {
        font-size: 20px;
      }
      input, textarea {
        font-size: 20px;
      }
    }

    @media (max-width: 600px) {
      font-size: 20px;
    }

    @media (min-width: 400px) {
      margin: auto;
    }

  }
`;

export function App() {
  const [, setLocation] = useLocation();

  async function logout() {
    await server.users.logout.post();
    setLocation(paths.home);
  }

  return (
    <>
      <GlobalStyle />
      <main>
        <Switch>
          <Route path={paths.home}>
            <Header>
              <h1>Home</h1>
              <ButtonGroup>
                <StyledLink href={paths.recipes}>Recipes</StyledLink>
                <StyledLink href={paths.createRecipe}>Create recipe</StyledLink>
                <StyledLink href={paths.login}>Login</StyledLink>
                <Button onClick={logout}>Logout</Button>
              </ButtonGroup>
            </Header>
          </Route>
          <Route path={paths.recipes} component={Recipes} />
          <Route path={paths.recipe} component={RecipePage} />
          <Route path={paths.createRecipe} component={CreateRecipe} />
          <Route path={paths.createAccount} component={CreateAccount} />
          <Route path={paths.login} component={Login} />
          <Route>404 Not found</Route>
        </Switch>
      </main>
    </>
  );
}

const Header = styled.header`
    background-color: pink;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5px;
`;
