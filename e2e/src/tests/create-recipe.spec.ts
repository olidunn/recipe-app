import { test, expect } from "@playwright/test";
import { url } from "inspector";
import { submitRecipeForm } from "~/helpers/create-recipe.js";
import { submitDeleteRecipeForm } from "~/helpers/delete-recipe.js";

// Make a delete recipe helper and delete after recipe is created in the spec file

// Submit recipe function, fills in form as:
// recipe name, serving, steps, ingredients
test("can create and delete a recipe", async ({ page }) => {
  await submitRecipeForm(page, {
    name: "sample recipe",
    servingSize: 2,
    recipeString: "1. make the recipe using {{ingredients}}",
  });

  await submitDeleteRecipeForm(page, "sample recipe");

  await expect(page).toHaveURL("/recipes");
  await expect(page.getByText("sample recipe")).not.toBeVisible();
  await expect(page.getByText("No recipes found")).toBeVisible();
});
