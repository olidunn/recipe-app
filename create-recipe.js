const recipeNameInput = document.getElementById("recipeName");
recipeNameInput.value = "My recipe name";

// The text area is assigned to this constant variable
const recipeStepsInput = document.getElementById("recipeStepsInput");
recipeStepsInput.value = `Heat a large pan over medium heat and add {{olive oil}}.

Once the oil is hot, add chopped {{onion}} and sauté until translucent.

Add minced {{garlic}} and cook for another minute.

Add {{diced tomatoes}} and {{vegetable broth}}, stirring to combine.

Stir in {{quinoa}} and bring to a boil.

Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked.

Stir in chopped {{spinach}} and cook until wilted.

Season with {{salt}} and {{black pepper}} to taste before serving.`;

function removeCurlyBrackets(ingredient) {
  return ingredient.slice(2, ingredient.length - 2);
}

function parseRecipe(recipeString, recipeName) {
  const recipe = {
    name: recipeName,
    steps: parseSteps(recipeString),
    ingredients: parseIngredients(recipeString),
  };

  return recipe;
}

function saveRecipe() {
  const recipe = parseRecipe(recipeStepsInput.value, recipeNameInput.value);
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  recipes.push(recipe);

  // We need to convert the javascript variable into a string so that we can store
  // it in localStorage. localStorage can only store string representations of data.
  localStorage.setItem("recipes", JSON.stringify(recipes));
  window.location.assign("/recipes.html");
}

function preview() {
  const recipe = parseRecipe(recipeStepsInput.value);
  renderIngredients(recipe.ingredients, "preview-ingredients");
  renderSteps(recipe.steps, "preview-steps");
}

/**
 * A function to identify the ingredient pattern and print as an array
 */
function parseIngredients(recipeStepsText) {
  const matches = [...recipeStepsText.matchAll(ingredientPattern)];

  const userIngredients = [];

  for (let index = 0; index < matches.length; index++) {
    const userIngredient = matches[index][0];
    userIngredients.push(removeCurlyBrackets(userIngredient));
  }

  return removeDuplicates(userIngredients);
}

// Split the recipeStepsText by new lines to create an array of steps
function parseSteps(recipeStepsText) {
  const recipeSteps = recipeStepsText.split(/\n\n/);

  const userSteps = [];

  for (let index = 0; index < recipeSteps.length; index++) {
    const userStep = recipeSteps[index];
    userSteps.push(userStep);
  }

  return userSteps;
}

function removeDuplicates(array) {
  return [...new Set(array)];
}

// Replace data upon submit
// Create the steps through new lines - Regex \r (check for a return)
// good pattern = /\w(.*)/g
