import { Link, Route, Switch } from "wouter";
import { Recipes } from "./pages/Recipes";
import { CreateRecipe } from "./pages/CreateRecipe";
import { routes } from "./common/routes";
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
    display: flex;
    flex-direction: column;
    gap: 32px;

    margin: 0 20px;

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
          <Route path={routes.home}>
            <h1>Home</h1>
            <Link href={routes.recipes}>Recipes</Link>
            <Link href={routes.createRecipe}>Create recipe</Link>
          </Route>
          <Route path={routes.recipes} component={Recipes} />
          <Route path={routes.createRecipe} component={CreateRecipe} />
          <Route>404 Not found</Route>
        </Switch>
      </main>
    </>
  );
}
