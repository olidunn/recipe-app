import { useParams, Redirect } from "wouter";
import { paths, routes } from "~/common/routes";
import { useCallback, useEffect, useState } from "react";
import { RecipeStep } from "~/components/RecipeStep";
import { Button } from "~/components/Button";
import { ButtonGroup } from "~/components/ButtonGroup";
import { StyledLink } from "~/components/LinkStyle";
import { Recipe } from "../CreateRecipe/utils";

// useParams to access id parameter
// useState returns an array: current state is recipe, then update state with setRecipe (new recipe)
// To load our data, we need to wait for the url to be fetched with an id: recipes/${id}
// If await function returns true, recipe is updated with the new recipe from server (using setRecipe)

export function RecipePage() {
  const { id } = useParams<{
    id: string;
  }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/recipes/${id}`
      );

      const recipeFromServer = await response.json();
      setRecipe(recipeFromServer);
    } catch (_error) {
      setRecipe(null);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function deleteRecipe(recipeId: string) {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/recipes/${recipeId}`,
      {
        method: "DELETE",
        mode: "cors",
      }
    );
    if (response.status === 204) {
      setShouldRedirect(true);
    }
    setLoading(false);
  }

  const [shouldRedirect, setShouldRedirect] = useState(false);

  // The ? in `foo?.bar` is called the optional chaining operator,
  // and it allows you to access deeply nested properties without worrying about
  // whether the property exists or not. If the property `foo` doesn't exist, the expression foo?.var
  // will return undefined instead of throwing an error.

  // The ?? in `foo ?? bar` is called the nullish coalescing operator.
  // The default value is on the right side of the operator,
  // and it will be returned if the left side is null or undefined.

  if (shouldRedirect) {
    return <Redirect to={routes.recipes} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (recipe === null) {
    return <div>Recipe not found</div>;
  }

  const { name, ingredients, steps } = recipe;

  return (
    <div>
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
              deleteRecipe(id);
            }
          }}
        >
          Delete Recipe
        </Button>
      </ButtonGroup>
    </div>
  );
}
