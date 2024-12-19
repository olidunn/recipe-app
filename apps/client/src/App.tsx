import { Route, Switch } from "wouter";
import { Recipes } from "./pages/Recipes";
import { CreateRecipe } from "./pages/CreateRecipe";
import { paths } from "./common/routes";
import { RecipePage } from "./pages/Recipe";
import { ButtonGroup } from "./components/ButtonGroup";
import { StyledLink } from "./components/LinkStyle";
import { createGlobalStyle } from "styled-components";

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
      width: 60%;
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
            <h1>Home</h1>
            <ButtonGroup>
              <StyledLink href={paths.recipes}>Recipes</StyledLink>
              <StyledLink href={paths.createRecipe}>Create recipe</StyledLink>
            </ButtonGroup>
          </Route>
          <Route path={paths.recipes} component={Recipes} />
          <Route path={paths.recipe} component={RecipePage} />
          <Route path={paths.createRecipe} component={CreateRecipe} />
          <Route>404 Not found</Route>
        </Switch>
      </main>
    </>
  );
}
