import { Fragment } from 'react';
import {
  ingredientPattern,
  removeCurlyBrackets,
} from '~/pages/CreateRecipe/utils';

type RecipeStepProps = { children: string };

export function RecipeStep({ children }: RecipeStepProps) {
  const stepParts = children.split(/(\{\{.*?\}\}|\s+)/);

  return (
    <>
      {stepParts.map((stepPart, index) => {
        const key = `${index}-${stepPart}`;

        if (ingredientPattern.test(stepPart)) {
          return (
            <Fragment key={key}>
              {index > 0 && ' '}
              <strong>{removeCurlyBrackets(stepPart)}</strong>
            </Fragment>
          );
        }

        return <Fragment key={key}>{stepPart}</Fragment>;
      })}
    </>
  );
}
