import { Link } from "wouter";
import { Button } from "../../components/Button";
import { routes } from "../../common/routes";

/**
 * TODO:
 * 1. Try loading the data from localStorage and displaying it on this page.
 * 2. When clicking save, look at the wouter documentation to see how to navigate to the recipes page.
 * 3. Go through the render.js file and start building React components for the sections and recipe card etc.
 * (components that will be displayed on this page as a list) use hardcoded (fake) data for now.
 *
 * https://www.typescriptlang.org/docs/
 * https://react.dev/learn
 * https://react.dev/reference/react
 * https://styled-components.com/docs
 * https://github.com/molefrog/wouter
 */
export function Recipes() {
  function deleteAllRecipes() {}

  return (
    <>
      <div id="recipe-list"></div>
      <Link className="button" href={routes.createRecipe}>
        Create Recipe
      </Link>
      <Button onClick={deleteAllRecipes}>Delete All Recipes</Button>
    </>
  );
}
