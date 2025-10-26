import type { RecipeResponse } from '@recipe-app/common';
import { RecipeRequestSchema } from '@recipe-app/common';
import { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'wouter';
import { to } from '~/common/paths';
import { server } from '~/common/server';
import type { ErrorByName } from '~/common/utils/schemaValidation';
import { validate } from '~/common/utils/schemaValidation';
import { InputNumber } from '~/components/InputNumber';
import { parseRecipe } from '~/pages/CreateRecipe/utils';
import { Button } from './Button';
import { Form } from './Form';
import { InputText } from './InputText';
import { TextArea } from './TextArea';

export type RecipeFormData = {
  name: string;
  steps: string;
  servingSize: number;
};

type RecipeFormProps<Mode extends 'create' | 'update'> = {
  data: RecipeFormData;
  mode: Mode;
} & (Mode extends 'update' ? { recipeId: string } : { recipeId?: never });

export function RecipeForm<Mode extends 'create' | 'update'>({
  data,
  mode,
  recipeId,
}: RecipeFormProps<Mode>) {
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const [recipeName, setRecipeName] = useState(data.name);
  const [servingSize, setServingSize] = useState(data.servingSize);
  const [recipeString, setRecipeString] = useState(data.steps);
  const [errorByName, setErrorByName] = useState<
    ErrorByName<typeof RecipeResponse>
  >({});

  async function save() {
    try {
      setSaving(true);

      const recipe = parseRecipe(recipeName, recipeString, servingSize);
      const validation = validate(recipe, RecipeRequestSchema);

      if (validation.failed) {
        setErrorByName(validation.errorByName);
        return;
      }

      const { error } =
        mode === 'create'
          ? await server.recipes.post(recipe)
          : // biome-ignore lint/style/noNonNullAssertion: We use type constraints to ensure recipeId is defined in update mode
            await server.recipes({ recipeId: recipeId! }).post(recipe);

      if (error) {
        throw error;
      }

      setLocation(to('/recipes', {}));
    } catch (_error) {
      // TODO: Replace with a toast using the sonner library
      setErrorByName({
        name: { message: 'We were unable to save your recipe.' },
      });
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
          errorMessage={errorByName.name?.message}
        />

        <InputNumber
          label="Serving Size"
          onChange={setServingSize}
          value={servingSize}
          errorMessage={errorByName.servingSize?.message}
        />

        <TextArea
          label="Steps"
          height={200}
          onChange={(event) => setRecipeString(event.target.value)}
          value={recipeString}
          errorMessage={
            errorByName.steps?.message || errorByName.ingredients?.message
          }
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
