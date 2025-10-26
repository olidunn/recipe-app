import { createGlobalStyle } from 'styled-components';
import { Redirect, Route, Switch } from 'wouter';
import { paths, to } from './common/paths';
import { CreateAccount } from './pages/CreateAccount';
import { CreateRecipe } from './pages/CreateRecipe';
import { Login } from './pages/Login';
import { RecipePage } from './pages/Recipe';
import { Recipes } from './pages/Recipes';
import { UpdateRecipe } from './pages/UpdateRecipe';

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
  return (
    <>
      <GlobalStyle />
      <main>
        <Switch>
          <Route path={paths.home}>
            <Redirect to={to('/recipes', {})} />
          </Route>
          <Route path={paths.recipes} component={Recipes} />
          <Route path={paths.createRecipe} component={CreateRecipe} />
          <Route path={paths.recipe} component={RecipePage} />
          <Route path={paths.updateRecipe} component={UpdateRecipe} />
          <Route path={paths.createAccount} component={CreateAccount} />
          <Route path={paths.login} component={Login} />
          <Route>404 Not found</Route>
        </Switch>
      </main>
    </>
  );
}
