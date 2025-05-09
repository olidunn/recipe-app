export function removeCurlyBrackets(ingredient: string): string {
  return ingredient.slice(2, ingredient.length - 2);
}

export const ingredientPattern = /\{\{.*?\}\}/g;

export type Recipe = {
  id: string;
  name: string;
  steps: string[];
  ingredients: string[];
};

export function parseRecipe(recipeName: string, recipeString: string): Omit<Recipe, 'id'> {
  return ({
    name: recipeName,
    steps: parseSteps(recipeString),
    ingredients: parseIngredients(recipeString),
  });
}

/**
 * @returns an error message, otherwise it saves the recipe
 */
export function saveRecipe(name: string, steps: string): string | void {
  const recipesString = localStorage.getItem("recipes");
  const recipes: Omit<Recipe, 'id'>[] = recipesString ? JSON.parse(recipesString) : [];

  if (name.length === 0 || steps.length === 0) {
    return "Recipe name and steps are required.";
  }

  const recipeNameExists = recipes.some((r) => r.name === name);
  if (recipeNameExists) {
    return "This recipe name already exists, please choose a different name.";
  }

  const recipe = parseRecipe(name, steps);
  recipes.push(recipe);

  // We need to convert the javascript variable into a string so that we can store
  // it in localStorage. localStorage can only store string representations of data.
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

// function preview() {
//   const recipe = parseRecipe(recipeStepsInput.value);
//   renderIngredients(recipe.ingredients, "preview-ingredients");
//   renderSteps(recipe.steps, "preview-steps");
// }

/**
 * A function to identify the ingredient pattern and print as an array
 */
function parseIngredients(recipeStepsText: string): string[] {
  const matches = [...recipeStepsText.matchAll(ingredientPattern)];

  const userIngredients = [];

  for (let index = 0; index < matches.length; index++) {
    const userIngredient = matches[index][0];
    userIngredients.push(removeCurlyBrackets(userIngredient));
  }

  return removeDuplicates(userIngredients);
}

// Split the recipeStepsText by new lines to create an array of steps
function parseSteps(recipeStepsText: string): string[] {
  const recipeSteps = recipeStepsText.split(/\n\n/);

  const userSteps = [];

  for (let index = 0; index < recipeSteps.length; index++) {
    const userStep = recipeSteps[index];
    userSteps.push(userStep);
  }

  return userSteps;
}

function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}
