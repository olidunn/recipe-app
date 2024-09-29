import { useState } from "react";
import { Button } from "../../components/Button";
import { ButtonGroup } from "../../components/ButtonGroup";
import { Form } from "../../components/Form";
import { InputText } from "../../components/InputText";
import { TextArea } from "../../components/TextArea";
import { saveRecipe } from "./utils";

export function CreateRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [recipeSteps, setRecipeSteps] = useState("");

  function preview() {}

  return (
    <>
      <Form>
        <InputText
          id="recipeName"
          label="Name"
          onChange={(event) => setRecipeName(event.target.value)}
          value={recipeName}
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
            onClick={() => saveRecipe(recipeName, recipeSteps)}
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
