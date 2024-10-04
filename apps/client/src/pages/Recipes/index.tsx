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

  return (
    <>
      {recipes.length === 0 && <p>No recipes found</p>}
      {recipes.map((recipe) => (
        <div key={recipe.name}>
          <h4>{recipe.name}</h4>
          <ul>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </div>
      ))}
      <Link className="button" href={routes.createRecipe}>
        Create Recipe
      </Link>
      <Button onClick={() => setRecipes([])}>Delete All Recipes</Button>
    </>
  );
}
