import { expect, test } from '~/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/recipes');
});

// After deleting, test should return with no recipes
// Page returns heading, create recipe link, delete all button, no recipes found
test('loads with no recipes', async ({ loggedInPage: page }) => {
  await expect(page.getByRole('heading', { name: 'Recipes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create Recipe' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Delete All Recipes' }),
  ).toBeVisible();
  await expect(page.getByText('No recipes found')).toBeVisible();
});
