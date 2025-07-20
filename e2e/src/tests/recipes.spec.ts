import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/recipes");

  const deleteButton = page.getByRole("button", { name: "Delete All Recipes" });

  await expect(deleteButton).toBeVisible();

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe(
      `Do you want to delete all recipes?\nType "delete" to confirm.`
    );
    await dialog.accept("delete");
  });

  await deleteButton.click();
  
});

test("loads with no recipes", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Recipes" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create Recipe" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Delete All Recipes" })
  ).toBeVisible();
  await expect(page.getByText("No recipes found")).toBeVisible();
});
