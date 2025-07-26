import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Navigates to localhost/recipes page
  await page.goto("/recipes");

  // Expect delete button to be on page
  const deleteButton = page.getByRole("button", { name: "Delete All Recipes" });

  await expect(deleteButton).toBeVisible();

  // Delete prompt appears, enter "delete"
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe(
      `Do you want to delete all recipes?\nType "delete" to confirm.`
    );
    await dialog.accept("delete");
  });

  await deleteButton.click();
});

// After deleting, test should return with no recipes
// Page returns heading, create recipe link, delete all button, no recipes found
test("loads with no recipes", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Recipes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create Recipe" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Delete All Recipes" })
  ).toBeVisible();
  await expect(page.getByText("No recipes found")).toBeVisible();
});
