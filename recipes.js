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
    recipeElement.appendChild(document.createElement("h2")).textContent =
      "My recipe name";

    const ingredientsElement = document.createElement("div");
    ingredientsElement.appendChild(document.createElement("h3")).textContent =
      "Ingredients";
    recipeElement.appendChild(ingredientsElement);

    const stepsElement = document.createElement("div");
    stepsElement.appendChild(document.createElement("h3")).textContent =
      "Steps";
    recipeElement.appendChild(stepsElement);

    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient = recipe.ingredients[i];
      const ingredientElement = document.createElement("div");

      ingredientElement.textContent = ingredient;
      ingredientsElement.appendChild(ingredientElement);
    }

    recipeList.appendChild(recipeElement);

    for (let i = 0; i < recipe.steps.length; i++) {
      const step = recipe.steps[i];
      const stepElement = document.createElement("div");

      // loop through the words in the step
      // If the word is an ingredient make it bold (strong tag)
      // you can try using regex with word boundaries to match the ingredient e.g. \w or \b
      // ingredientsSet.has(ingredient);

      stepElement.textContent = step;
      stepsElement.appendChild(stepElement);
    }

    recipeList.appendChild(recipeElement);
  }
}

renderRecipes();
