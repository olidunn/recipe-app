import { useState } from "react";
import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { InputText } from "../../components/InputText";
import { TextArea } from "../../components/TextArea";
import { useLocation } from "wouter";
import { paths } from "../../common/routes";
import { parseRecipe } from "./utils";

export function CreateRecipe() {
  const [saving, setSaving] = useState(false);
  const [_, setLocation] = useLocation();
  const [recipeName, setRecipeName] = useState("");
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
  const [error, setError] = useState<string | null>(null);

  async function save() {
    try {
      setSaving(true);
      const recipe = parseRecipe(recipeName, recipeString, servingSize);
      await fetch("http://localhost:8787/recipes", {
        body: JSON.stringify(recipe),
        method: "POST",
      });
      setLocation(paths.recipes);
    } catch (error) {
      const errorMessage = "";

      if (errorMessage) {
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form>
      <InputText
        id="recipeName"
        label="Name"
        onChange={(event) => setRecipeName(event.target.value)}
        value={recipeName}
        error={error}
      />

      <InputText
        id="servingSize"
        label="Serving Size"
        onChange={(event) => setServingSize(Number(event.target.value))}
        value={servingSize.toString()}
        error={error}
      />

      <TextArea
        height={200}
        onChange={(event) => setRecipeString(event.target.value)}
        value={recipeString}
      />

      <Button
        style={{
          marginLeft: "auto",
        }}
        onClick={save}
      >
        {saving ? "loading..." : "Save"}
      </Button>

      <div id="preview-ingredients"></div>
      <div id="preview-steps"></div>
    </Form>
  );
}
