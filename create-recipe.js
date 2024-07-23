let ingredientsListElement = null;
let stepsListElement = null;

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

const ingredientPattern = /\{\{.*?\}\}/g;

function removeCurlyBrackets(ingredient) {
  return ingredient.slice(2, ingredient.length - 2);
}

function saveRecipe() {
  const recipe = {
    steps: [
      "Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked.",
      "Stir in chopped spinach and cook until wilted.",
    ],
    ingredients: ["salt", "black pepper"],
  };

  // We need to convert the javascript variable into a string so that we can store
  // it in localStorage. localStorage can only store string representations of data.
  localStorage.setItem("recipes", JSON.stringify([recipe]));
  window.location.assign("/recipes.html");
}

/**
 * A function to identify the ingredient pattern and print as an array
 */
function extractIngredientsFromRecipeSteps(recipeStepsText) {
  const matches = [...recipeStepsText.matchAll(ingredientPattern)];

  const userIngredients = [];

  for (let index = 0; index < matches.length; index++) {
    const userIngredient = matches[index][0];
    userIngredients.push(removeCurlyBrackets(userIngredient));
  }

  return removeDuplicates(userIngredients);
}

// Split the recipeStepsText by new lines to create an array of steps
function extractStepsFromRecipe(recipeStepsText) {
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

function createStepListItem(step) {
  const words = step.split(/(\{\{.*?\}\}|\s+)/);
  const listItemElement = document.createElement("li");

  for (let index = 0; index < words.length; index++) {
    const word = words[index];

    if (ingredientPattern.test(word)) {
      const ingredientElement = document.createElement("strong");
      let ingredientText = removeCurlyBrackets(word);

      if (index > 0) {
        ingredientText = ` ${ingredientText}`;
      }

      ingredientElement.textContent = ingredientText;
      listItemElement.appendChild(ingredientElement);
    } else {
      const textNode = document.createTextNode(
        index > 0 && word !== "." && word !== "," && word !== ";"
          ? ` ${word}`
          : word
      );
      listItemElement.appendChild(textNode);
    }
  }

  return listItemElement;
}

function renderSteps() {
  const steps = extractStepsFromRecipe(recipeStepsInput.value);

  if (steps.length === 0) {
    return;
  }

  // Creating an ordered list if it doesn't exist yet
  if (stepsListElement === null) {
    stepsListElement = document.createElement("ol");
    const stepsHeadingElement = document.getElementById("stepsHeading");
    stepsHeadingElement.after(stepsListElement);
  } else {
    stepsListElement.innerHTML = "";
  }

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    stepsListElement.appendChild(createStepListItem(step));
  }
}

// This function is used to print the ingredients as a list
function renderIngredients() {
  // Using the extractIngredients function and assigning it to a constant variable
  const ingredients = extractIngredientsFromRecipeSteps(recipeStepsInput.value);

  if (ingredients.length === 0) {
    return;
  }

  // Creating an unordered list if it doesn't exist yet
  if (ingredientsListElement === null) {
    ingredientsListElement = document.createElement("ul");
    const ingredientsHeadingElement =
      document.getElementById("ingredientsHeading");
    ingredientsHeadingElement.after(ingredientsListElement);
  } else {
    ingredientsListElement.innerHTML = "";
  }

  for (let index = 0; index < ingredients.length; index++) {
    // Creating a list item within the unordered list
    const listItemElement = document.createElement("li");
    listItemElement.textContent = ingredients[index];
    listItemElement.setAttribute("class", "listItem");
    ingredientsListElement.appendChild(listItemElement);
  }
}

// Replace data upon submit
// Create the steps through new lines - Regex \r (check for a return)
// good pattern = /\w(.*)/g
