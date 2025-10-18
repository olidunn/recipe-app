import type { RecipeRecordType } from '@recipe-app/server/src/recipes/schemas';
import { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'wouter';
import { paths } from '~/common/routes';
import { server } from '~/common/server';
import { parseRecipe } from '~/pages/CreateRecipe/utils';
import { Button } from './Button';
import { Form } from './Form';
import { InputText } from './InputText';
import { TextArea } from './TextArea';

type RecipeFormProps = { data: RecipeRecordType; mode: 'create' | 'update' };

export function RecipeForm({ data, mode }: RecipeFormProps) {
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const [recipeName, setRecipeName] = useState(data.name);
  const [servingSize, setServingSize] = useState(data.servingSize);
  const [recipeString, setRecipeString] = useState(data.steps);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function save() {
    try {
      setSaving(true);
      const recipe = parseRecipe(recipeName, recipeString, servingSize);
      const { error } = await server.recipes.post(recipe);

      if (error) {
        throw error;
      }

      setLocation(paths.recipes);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('We were unable to save your recipe.');
      }
    } finally {
      setSaving(false);
    }
  }

  let buttonName = 'Create';
  if (mode === 'update') {
    buttonName = 'Update';
  }

  if (saving) {
    buttonName = 'saving...';
  }

  return (
    <Container>
      <h1>{mode === 'create' ? 'Create recipe' : 'Update recipe'}</h1>
      <Form>
        <InputText
          label="Name"
          onChange={(event) => setRecipeName(event.target.value)}
          value={recipeName}
          error={errorMessage}
        />

        <InputText
          label="Serving Size"
          onChange={(event) => setServingSize(Number(event.target.value))}
          value={servingSize.toString()}
          error={errorMessage}
        />

        <TextArea
          label="Steps"
          height={200}
          onChange={(event) => setRecipeString(event.target.value)}
          value={recipeString}
        />

        <Button
          style={{
            marginLeft: 'auto',
          }}
          onClick={save}
        >
          {buttonName}
        </Button>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  padding: 16px;
`;
