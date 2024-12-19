import { useParams, Redirect } from "wouter";
import { useLocalStorage } from "../../common/hooks/useLocalStorage";
import { paths, routes } from "../../common/routes";
import { useState } from "react";
import { RecipeStep } from "../../components/RecipeStep";
import { Button } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { StyledLink } from "../../components/LinkStyle";

export function RecipePage() {
  const { name } = useParams<{
    name: string;
  }>();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [recipes, setRecipes] = useLocalStorage("recipes", []);

  //// Expanded code version
  //   const recipe = recipes.find((r) => r.name === name);
  //   let ingredients: string[] = [];
  //   if(recipe) {
  //     ingredients = recipe.ingredients;
  //   }

  // The ? in `foo?.bar` is called the optional chaining operator,
  // and it allows you to access deeply nested properties without worrying about
  // whether the property exists or not. If the property `foo` doesn't exist, the expression foo?.var
  // will return undefined instead of throwing an error.

  // The ?? in `foo ?? bar` is called the nullish coalescing operator.
  // The default value is on the right side of the operator,
  // and it will be returned if the left side is null or undefined.
  const recipe = recipes.find((r) => r.name === name);
  const ingredients = recipe?.ingredients ?? [];
  const steps = recipe?.steps ?? [];

  function deleteRecipe(recipeName: string) {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((r) => r.name !== recipeName)
    );
    setShouldRedirect(true);
  }

  if (shouldRedirect) {
    return <Redirect to={routes.recipes} />;
  }

  return (
    <div key={name}>
      <h3>{name}</h3>
      <h4>Ingredients</h4>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
      <h4>Steps</h4>
      <ul>
        {steps.map((step) => (
          <li key={step}>
            <RecipeStep>{step}</RecipeStep>
          </li>
        ))}
      </ul>
      <ButtonGroup>
        <StyledLink href={paths.recipes}>Recipes</StyledLink>
        <Button
          onClick={() => {
            const confirmed =
              prompt(`
            Do you want to delete this recipe?
            Type "delete" to confirm.
            `) === "delete";

            if (confirmed) {
              deleteRecipe(name);
            }
          }}
        >
          Delete Recipe
        </Button>
      </ButtonGroup>
    </div>
  );
}
