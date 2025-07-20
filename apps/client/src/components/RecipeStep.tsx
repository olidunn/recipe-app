import { Fragment } from "react";
import {
  ingredientPattern,
  removeCurlyBrackets,
} from "~/pages/CreateRecipe/utils";

type RecipeStepProps = { children: string };

export function RecipeStep({ children }: RecipeStepProps) {
  const stepParts = children.split(/(\{\{.*?\}\}|\s+)/);

  return (
    <>
      {stepParts.map((stepPart, index) => {
        if (ingredientPattern.test(stepPart)) {
          return (
            <Fragment key={index}>
              {index > 0 && " "}
              <strong key={index}>{removeCurlyBrackets(stepPart)}</strong>
            </Fragment>
          );
        } else {
          return <Fragment key={index}>{stepPart}</Fragment>;
        }
      })}
    </>
  );
}
