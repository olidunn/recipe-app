import { Link } from "wouter";
import { Button } from "../../components/Button";
import { routes } from "../../common/routes";
import { useLocalStorage } from "../../common/hooks/useLocalStorage";

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

  function deleteRecipe(recipeId: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.name !== recipeId)
    );
  }

  return (
    <>
      {recipes.length === 0 && <p>No recipes found</p>}
      {recipes.map((recipe) => (
        <div key={recipe.name}>
          <h3>{recipe.name}</h3>
          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h4>Steps</h4>
          <ul>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <Button onClick={() => deleteRecipe(recipe.name)}>
            Delete Recipe
          </Button>
        </div>
      ))}
      <Link className="button" href={routes.createRecipe}>
        Create Recipe
      </Link>
      <Button onClick={deleteAllRecipes}>Delete All Recipes</Button>
    </>
  );
}
