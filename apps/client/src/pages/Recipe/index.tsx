import type { Recipe } from '@recipe-app/server/src/recipes/schemas';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'wouter';
import { paths, routes } from '~/common/routes';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Container } from '~/components/Container';
import { Header } from '~/components/Header';
import { StyledLink } from '~/components/LinkStyle';
import { RecipeStep } from '~/components/RecipeStep';

// useParams to access id parameter
// useState returns an array: current state is recipe, then update state with setRecipe (new recipe)
// To load our data, we need to wait for the url to be fetched with an id: recipes/${id}
// If await function returns true, recipe is updated with the new recipe from server (using setRecipe)

export function RecipePage() {
  const { recipeId } = useParams<{ recipeId: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data, error } = await server.recipes({ recipeId }).get();
    if (error) {
      setRecipe(null);
    }
    setRecipe(data);
    setLoading(false);
  }, [recipeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function deleteRecipe(id: string) {
    setLoading(true);
    const { error } = await server['recipes']({ recipeId: id }).delete();
    if (error) {
      throw error;
    }

    setShouldRedirect(true);
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
    <Container>
      <Header>
        <h1>{name}</h1>
        <ButtonGroup>
          <StyledLink href={paths.home}>Home</StyledLink>
          <StyledLink href={paths.createRecipe}>Create recipe</StyledLink>
          <StyledLink href={paths.recipes}>Recipes</StyledLink>
        </ButtonGroup>
      </Header>
      <div>
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
              <RecipeStepCard>
                <RecipeStep>{step}</RecipeStep>
              </RecipeStepCard>
            </li>
          ))}
        </ul>
        <ButtonGroup>
          <Button
            onClick={() => {
              const confirmed =
                prompt(`
              Do you want to delete this recipe?
              Type "delete" to confirm.
              `) === 'delete';

              if (confirmed) {
                void deleteRecipe(recipeId);
              }
            }}
          >
            Delete Recipe
          </Button>
        </ButtonGroup>
      </div>
    </Container>
  );
}

const RecipeStepCard = styled.div`
  padding: 12px;
  border: 1px solid pink;
  border-radius: 10px;
`;
