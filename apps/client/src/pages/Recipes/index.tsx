import { Link } from "wouter";
import { Button } from "../../components/Button";
import { paths } from "../../common/routes";
import { useLocalStorage } from "../../common/hooks/useLocalStorage";

import { Recipe } from "../../components/Recipe";

/**
 * TODO:
 * Go through the render.js file and start building React components for the sections and recipe card etc.
 *
 * https://www.typescriptlang.org/docs/
 * https://react.dev/learn
 * https://react.dev/reference/react
 * https://styled-components.com/docs
 * https://github.com/molefrog/wouter
 */

export function Recipes() {
  const [recipes, setRecipes] = useLocalStorage("recipes", []);

  function deleteAllRecipes() {
    setRecipes([]);
  }

  function deleteRecipe(recipeName: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.name !== recipeName)
    );
  }

  return (
    <>
      {recipes.length === 0 && <p>No recipes found</p>}
      {recipes.map((recipe) => (
        <Recipe
          key={recipe.name}
          name={recipe.name}
          ingredients={recipe.ingredients}
          steps={recipe.steps}
          onDelete={deleteRecipe}
        />
      ))}
      <Link className="button" href={paths.createRecipe}>
        Create Recipe
      </Link>
      <Button onClick={deleteAllRecipes}>Delete All Recipes</Button>
    </>
  );
}
