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

export function CreateRecipe() {
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const [recipeName, setRecipeName] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [recipeString, setRecipeString] =
    useState(`Heat a large pan over medium heat and add {{olive oil}}.

Once the oil is hot, add chopped {{onion}} and sauté until translucent.

Add minced {{garlic}} and cook for another minute.

Add {{diced tomatoes}} and {{vegetable broth}}, stirring to combine.

Stir in {{quinoa}} and bring to a boil.

Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked.

Stir in chopped {{spinach}} and cook until wilted.

Season with {{salt}} and {{black pepper}} to taste before serving.`);
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

  return (
    <Container>
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
          {saving ? 'loading...' : 'Save'}
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
