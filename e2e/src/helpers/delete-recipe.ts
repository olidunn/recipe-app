import type { Page } from '@playwright/test';
import { expect } from '~/test';

// Navigate by recipe name, not id

export async function submitDeleteRecipeForm(page: Page) {
  await page.goto('/recipes');

  const recipeName = page.getByRole('link', {
    name: 'sample recipe',
    exact: true,
  });
  await expect(recipeName).toBeVisible();
  await recipeName.click();

  const deleteButton = page.getByRole('button', { name: 'Delete Recipe' });

  await expect(deleteButton).toBeVisible();

  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    expect(dialog.message()).toBe(
      `
Do you want to delete this recipe?
Type "delete" to confirm.
`,
    );
    await dialog.accept('delete');
  });

  await deleteButton.click();
}
