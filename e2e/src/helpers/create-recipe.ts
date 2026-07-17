import type { Page } from '@playwright/test';
import { expect } from '~/test';

export async function submitRecipeForm(
  page: Page,
  data: {
    name: string;
    servingSize: number;
    cookingMinutes: number;
    preparationMinutes: number;
    recipeString: string;
  },
) {
  // Go to localhost/create
  await page.goto('/recipes/create');

  // Get textbox for recipe name
  const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
  await expect(nameInput).toBeVisible();

  // Get textbox for serving size
  const servingSizeInput = page.getByRole('textbox', {
    name: 'Serving Size',
    exact: true,
  });
  await expect(servingSizeInput).toBeVisible();

  const cookingMinutes = page.getByRole('textbox', {
    name: 'Preparation Time',
    exact: true,
  });
  await expect(cookingMinutes).toBeVisible();

  const preparationMinutes = page.getByRole('textbox', {
    name: 'Cooking Time',
    exact: true,
  });
  await expect(preparationMinutes).toBeVisible();

  // Get textbox for recipe steps
  const recipeStringInput = page.getByRole('textbox', {
    name: 'Steps',
    exact: true,
  });
  await expect(recipeStringInput).toBeVisible();

  // Fill the textboxes for recipe name, serving size, steps
  await nameInput.fill(data.name);
  await servingSizeInput.fill(String(data.servingSize));
  await cookingMinutes.fill(String(data.cookingMinutes));
  await preparationMinutes.fill(String(data.preparationMinutes));
  await recipeStringInput.fill(data.recipeString);

  // Click submit button, creates recipe
  await page
    .getByRole('button', {
      name: 'Create',
      exact: true,
    })
    .click();
}
