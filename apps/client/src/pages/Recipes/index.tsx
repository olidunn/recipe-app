import type { Recipe } from '@recipe-app/common';
import { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Link } from '~/components/Link';
import { Loading } from '~/components/Loading';

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
      {loading && <Loading size={30} />}
      {recipes.length > 0 && (
        <RecipeList>
          {recipes.map((recipe) => (
            <RecipeLink
              key={recipe.id}
              to={to('/recipes/:recipeId', { recipeId: recipe.id })}
            >
              {recipe.name}
              <RecipeLinkSubheading>
                Serves {recipe.servingSize}
              </RecipeLinkSubheading>

              <RecipeLinkSubheading>
                Preparation Time: {recipe.preparationMinutes}m
              </RecipeLinkSubheading>

              <RecipeLinkSubheading>
                Cooking Time: {recipe.cookingMinutes}m
              </RecipeLinkSubheading>
            </RecipeLink>
          ))}
        </RecipeList>
      )}
      <ButtonGroup>
        <Link to={to('/recipes/create')}>Create recipe</Link>
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

const fadeIn = keyframes`
  from {
    opacity: 0
  }

  to {
    opacity: 1;
  }
`;

const RecipeLink = styled(Link)`
  background-color: pink;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  color: black;
  font-weight: bold;
  box-shadow: 2px 2px 10px 2px rgba(48, 47, 47, 0.2);
  animation: ${fadeIn} 0.5s; 
`;

const RecipeLinkSubheading = styled.p`
  font-weight: normal;
  margin: 0;
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
