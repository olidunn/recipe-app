import { Link } from "wouter";
import { Button } from "../../components/Button";
import { paths, routes } from "../../common/routes";
import { useLocalStorage } from "../../common/hooks/useLocalStorage";
import styled from "styled-components";
import { StyledLink } from "../../components/LinkStyle";

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

  return (
    <Container>
      <h1 style={{ margin: 0 }}>Recipes</h1>
      {recipes.length === 0 && <p>No recipes found</p>}
      <RecipeList>
        {recipes.map((recipe) => (
          <RecipeLink key={recipe.name} href={routes.recipe(recipe.name)}>
            {recipe.name}
          </RecipeLink>
        ))}
      </RecipeList>
      <ButtonGroup>
        <StyledLink href={paths.createRecipe}>Create Recipe</StyledLink>
        <Button
          onClick={() => {
            const confirmed =
              prompt(`
            Do you want to delete all recipes?
            Type "delete" to confirm.
            `) === "delete";
            if (confirmed) {
              deleteAllRecipes();
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 16px;
`;
