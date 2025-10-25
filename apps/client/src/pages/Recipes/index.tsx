import type { Recipe } from '@recipe-app/server/src/recipes/schemas';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'wouter';
import { applyParams, paths } from '~/common/paths';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { StyledLink } from '~/components/LinkStyle';

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data, error } = await server.recipes.get();
    if (error) {
      throw error;
    }

    setRecipes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function deleteAllRecipes() {
    setLoading(true);
    const { error } = await server.recipes.delete();

    if (error) {
      throw error;
    }

    setRecipes([]);
    setLoading(false);
  }

  return (
    <Container>
      <h1>Recipes</h1>
      {recipes.length === 0 && !loading && <p>No recipes found</p>}
      {loading && <p>Loading...</p>}
      {recipes.length > 0 && (
        <RecipeList>
          {recipes.map((recipe) => (
            <RecipeLink
              key={recipe.id}
              href={applyParams(paths.recipe, { recipeId: recipe.id })}
              style={{
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.5s',
              }}
            >
              {recipe.name}
            </RecipeLink>
          ))}
        </RecipeList>
      )}
      <ButtonGroup>
        <StyledLink href={paths.createRecipe}>Create recipe</StyledLink>
        <Button
          onClick={() => {
            const confirmed =
              prompt(`Do you want to delete all recipes?
                        Type "delete" to confirm.`) === 'delete';
            if (confirmed) {
              void deleteAllRecipes();
            }
          }}
        >
          Delete All Recipes
        </Button>
      </ButtonGroup>
    </Container>
  );
}

const RecipeLink = styled(Link)`
  background-color: pink;
  display: grid;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  color: black;
  font-weight: bold;
  box-shadow: 2px 2px 10px 2px rgba(48, 47, 47, 0.2);
`;

const RecipeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;
