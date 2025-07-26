import { expect, Page } from "@playwright/test";

export async function submitRecipeForm(
  page: Page,
  data: { name: string; servingSize: number; recipeString: string }
) {
  // Go to localhost/create-recipe
  await page.goto("/create-recipe");

  // Get textbox for recipe name
  const nameInput = page.getByRole("textbox", { name: "Name", exact: true });
  await expect(nameInput).toBeVisible();

  // Get textbox for serving size
  const servingSizeInput = page.getByRole("textbox", {
    name: "Serving Size",
    exact: true,
  });
  await expect(servingSizeInput).toBeVisible();

  // Get textbox for recipe steps
  const recipeStringInput = page.getByRole("textbox", {
    name: "Steps",
    exact: true,
  });
  await expect(recipeStringInput).toBeVisible();

  // Fill the textboxes for recipe name, serving size, steps
  await nameInput.fill(data.name);
  await servingSizeInput.fill(String(data.servingSize));
  await recipeStringInput.fill(data.recipeString);

  // Click submit button, creates recipe
  await page
    .getByRole("button", {
      name: "Save",
      exact: true,
    })
    .click();
}
