import { expect, Page } from "@playwright/test";

export async function submitRecipeForm(
  page: Page,
  data: { name: string; servingSize: number; recipeString: string }
) {
  await page.goto("/create-recipe");
  const nameInput = page.getByRole("textbox", { name: "Name", exact: true });
  await expect(nameInput).toBeVisible();

  const servingSizeInput = page.getByRole("textbox", {
    name: "Serving Size",
    exact: true,
  });
  await expect(servingSizeInput).toBeVisible();

  const recipeStringInput = page.getByRole("textbox", {
    name: "Steps",
    exact: true,
  });
  await expect(recipeStringInput).toBeVisible();

  await nameInput.fill(data.name);
  await servingSizeInput.fill(String(data.servingSize));
  await recipeStringInput.fill(data.recipeString);

  await page
    .getByRole("button", {
      name: "Save",
      exact: true,
    })
    .click();
}
