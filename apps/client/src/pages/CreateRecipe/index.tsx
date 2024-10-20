import { useState } from "react";
import { Button } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { Form } from "../../components/Form";
import { InputText } from "../../components/InputText";
import { TextArea } from "../../components/TextArea";
import { saveRecipe } from "./utils";
import { useLocation } from "wouter";
import { routes } from "../../common/routes";

export function CreateRecipe() {
  const [_, setLocation] = useLocation();
  const [recipeName, setRecipeName] = useState("");
  const [recipeSteps, setRecipeSteps] =
    useState(`Heat a large pan over medium heat and add {{olive oil}}.

Once the oil is hot, add chopped {{onion}} and sauté until translucent.

Add minced {{garlic}} and cook for another minute.

Add {{diced tomatoes}} and {{vegetable broth}}, stirring to combine.

Stir in {{quinoa}} and bring to a boil.

Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked.

Stir in chopped {{spinach}} and cook until wilted.

Season with {{salt}} and {{black pepper}} to taste before serving.`);
  const [error, setError] = useState<string | null>(null);

  function preview() {}

  function save() {
    const errorMessage = saveRecipe(recipeName, recipeSteps);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setLocation(routes.recipes);
  }

  return (
    <>
      <Form>
        <InputText
          id="recipeName"
          label="Name"
          onChange={(event) => setRecipeName(event.target.value)}
          value={recipeName}
          error={error}
        />
        <TextArea
          height={200}
          onChange={(event) => setRecipeSteps(event.target.value)}
          value={recipeSteps}
        />
        <ButtonGroup>
          <Button
            style={{
              marginLeft: "auto",
            }}
            onClick={preview}
          >
            Preview
          </Button>
          <Button
            style={{
              marginLeft: "auto",
            }}
            onClick={save}
          >
            Save
          </Button>
        </ButtonGroup>

        <div id="preview-ingredients"></div>
        <div id="preview-steps"></div>
      </Form>
    </>
  );
}
