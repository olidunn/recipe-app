const ingredientPattern = /\{\{.*?\}\}/g;

function removeCurlyBrackets(ingredient) {
  return ingredient.slice(2, ingredient.length - 2);
}

function renderSteps(steps, parentId) {
  if (steps.length === 0) {
    return;
  }

  const parentElement = document.getElementById(parentId);
  if (parentElement === null) {
    throw new Error("Parent element does not exist.");
  }

  let stepsListElement = null;
  const stepsElement = document.createElement("section");
  const stepsHeadingElement = document.createElement("h3");
  stepsElement.appendChild(stepsHeadingElement).textContent = "Steps";

  // Creating an ordered list if it doesn't exist yet
  if (stepsListElement === null) {
    stepsListElement = document.createElement("ol");
    stepsHeadingElement.after(stepsListElement);
  } else {
    stepsListElement.innerHTML = "";
  }

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];
    stepsListElement.appendChild(createStepListItem(step));
  }

  stepsElement.appendChild(stepsListElement);
  parentElement.replaceChildren(stepsElement);
}

// This function is used to print the ingredients as a list
function renderIngredients(ingredients, parentId) {
  if (ingredients.length === 0) {
    return;
  }

  const parentElement = document.getElementById(parentId);
  if (parentElement === null) {
    throw new Error("Parent element does not exist.");
  }

  let ingredientsListElement = null;
  const ingredientsElement = document.createElement("section");
  const ingredientsHeadingElement = document.createElement("h3");
  ingredientsElement.appendChild(ingredientsHeadingElement).textContent =
    "Ingredients";

  // Creating an unordered list if it doesn't exist yet
  if (ingredientsListElement === null) {
    ingredientsListElement = document.createElement("ul");
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

  ingredientsElement.appendChild(ingredientsListElement);
  parentElement.replaceChildren(ingredientsElement);
}

function renderRecipes() {
  const recipeList = document.getElementById("recipe-list");
  // This helps us as developers know when we for example, forgot to add the "recipe-list" element to the page.
  if (recipeList === null) {
    throw new Error("There is no recipe list element on this page.");
  }

  // We need to use JSON.parse to convert the string back to an object, so that we can use it.
  const recipes = JSON.parse(localStorage.getItem("recipes"));
  if (recipes === null) {
    // this is a dangerous way of changing the DOM, better to use append child instead
    recipeList.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const ingredientsSet = new Set(recipe.ingredients);
    const recipeElement = document.createElement("div");
    const recipeId = `recipe-${i}`;
    recipeElement.setAttribute("id", recipeId);
    recipeElement.appendChild(document.createElement("h2")).textContent =
      recipe.name;

    const ingredientsElement = document.createElement("div");
    ingredientsElement.setAttribute("id", `${recipeId}-ingredients`);
    recipeElement.appendChild(ingredientsElement);

    const stepsElement = document.createElement("div");
    stepsElement.setAttribute("id", `${recipeId}-steps`);
    recipeElement.appendChild(stepsElement);

    recipeList.appendChild(recipeElement);
    renderIngredients(recipe.ingredients, ingredientsElement.id);
    renderSteps(recipe.steps, stepsElement.id);
  }
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

function deleteAllRecipes() {
  localStorage.clear("recipes");
  renderRecipes();
}
