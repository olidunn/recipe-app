import styled from "styled-components";
import { Button } from "../Button";
import { RecipeStep } from "../RecipeStep";
import { Link } from "wouter";
import { routes } from "../../common/routes";

type RecipeProps = {
  name: string;
  ingredients: string[];
  steps: string[];
  onDelete: (recipeName: string) => void;
};

export function Recipe({ name, ingredients, steps, onDelete }: RecipeProps) {
  return (
    <Container key={name}>
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

      <Link className="button" href={routes.recipe(name)}>
        Go to recipe
      </Link>
      <Button onClick={() => onDelete(name)}>Delete Recipe</Button>
    </Container>
  );
}

export const Container = styled.div`
  background-color: pink;
  display: grid;
`;
