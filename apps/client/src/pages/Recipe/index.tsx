import type { Recipe } from '@recipe-app/common';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect, useParams } from 'wouter';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { ButtonGroup } from '~/components/ButtonGroup';
import { Container } from '~/components/Container';
import { Link } from '~/components/Link';
import { Loading } from '~/components/Loading';
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
    return <Redirect to={to('/recipes')} />;
  }

  if (loading) {
    return <Loading size={30} />;
  }

  if (recipe === null) {
    return <div>Recipe not found</div>;
  }

  const {
    name,
    ingredients,
    servingSize,
    preparationMinutes,
    cookingMinutes,
    steps,
  } = recipe;

  return (
    <Container>
      <h1>{name}</h1>
      <ButtonGroup>
        <Link to={to('/recipes/:recipeId/update', { recipeId })}>
          Update recipe
        </Link>
        <Link to={to('/recipes')}>Recipes</Link>
      </ButtonGroup>

      <RecipeDetails>
        <IngredientsContainer>
          <h3>Ingredients ({ingredients.length})</h3>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </IngredientsContainer>

        <div>
          <h3>Serving size: {servingSize}</h3>

          {preparationMinutes && (
            <h3>Preparation Time: {preparationMinutes}m</h3>
          )}

          {cookingMinutes && <h3>Cooking Time: {cookingMinutes}m</h3>}

          <h3>Steps</h3>
          <UL>
            {steps.map((step, index) => (
              <li key={step}>
                <RecipeStepCard>
                  <h3>Step {index + 1}</h3>
                  <RecipeStep>{step}</RecipeStep>
                </RecipeStepCard>
              </li>
            ))}
          </UL>
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
      </RecipeDetails>
    </Container>
  );
}

const UL = styled.ul`
  list-style: none;
`;

const IngredientsContainer = styled.div`
  padding: 12px;
  border: 1px solid pink;
  border-radius: 10px;
  height: fit-content;
`;

const RecipeStepCard = styled.div`
  padding: 12px;
  border: 1px solid turquoise;
  border-radius: 10px;
`;

const RecipeDetails = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;
`;
