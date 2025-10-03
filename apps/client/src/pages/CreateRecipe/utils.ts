export function removeCurlyBrackets(ingredient: string): string {
  return ingredient.slice(2, ingredient.length - 2);
}

export const ingredientPattern = /\{\{.*?\}\}/g;

export type Recipe = {
  id: string;
  name: string;
  steps: string[];
  servingSize: number;
  ingredients: string[];
};

export function parseRecipe(
  recipeName: string,
  recipeString: string,
  servingSize: number,
): Omit<Recipe, 'id'> {
  return {
    name: recipeName,
    steps: parseSteps(recipeString),
    servingSize,
    ingredients: parseIngredients(recipeString),
  };
}

/**
 * A function to identify the ingredient pattern and print as an array
 */
function parseIngredients(recipeStepsText: string): string[] {
  const matches = [...recipeStepsText.matchAll(ingredientPattern)];

  const userIngredients: string[] = [];

  for (let index = 0; index < matches.length; index++) {
    const userIngredient = matches[index]?.[0];

    if (userIngredient?.length) {
      userIngredients.push(removeCurlyBrackets(userIngredient));
    }
  }

  return removeDuplicates(userIngredients);
}

// Split the recipeStepsText by new lines to create an array of steps
function parseSteps(recipeStepsText: string): string[] {
  const recipeSteps = recipeStepsText.split(/\n/);
  const userSteps: string[] = [];

  for (let index = 0; index < recipeSteps.length; index++) {
    const userStep = recipeSteps[index];

    if (userStep) {
      userSteps.push(userStep);
    }
  }

  return userSteps;
}

function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}
