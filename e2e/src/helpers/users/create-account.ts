import type { Page, TestInfo } from '@playwright/test';
import { to } from '@recipe-app/common';
import type { TestUser } from '~/fixtures/authenticated.fixture';
import { verifyEmail } from '~/helpers/users/verify-email';
import { expect } from '~/test';

/**
 * Creates a unique test user for parallel test execution.
 *
 * Appends `TestInfo.workerIndex` and `TestInfo.testId` to email to avoid conflicts.
 */
export function createUniqueTestUser(testInfo: TestInfo): TestUser {
  return {
    name: 'Test User',
    email: `e2e-${testInfo.workerIndex}-${testInfo.testId}@email.recipe-app.com`,
    password: 'SecureTestPassword123!',
  };
}

export async function submitCreateAccountForm(
  page: Page,
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
): Promise<void> {
  const { name, email, password, confirmPassword } = data;

  await page.goto(to('/create-account'));

  const nameInput = page.getByRole('textbox', { name: 'Name', exact: true });
  const emailInput = page.getByRole('textbox', { name: 'Email', exact: true });
  const passwordInput = page.getByRole('textbox', {
    name: 'Password',
    exact: true,
  });
  const confirmPasswordInput = page.getByRole('textbox', {
    name: 'Confirm password',
    exact: true,
  });

  await nameInput.fill(name);
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await confirmPasswordInput.fill(confirmPassword);

  const form = page.locator('form');
  await expect(form).toBeVisible();

  await form.press('Enter');
}

export async function createAccount(
  page: Page,
  { name, email, password }: TestUser,
): Promise<void> {
  await submitCreateAccountForm(page, {
    name,
    email,
    password,
    confirmPassword: password,
  });

  await expect(page).toHaveURL(to('/create-account'));
  await expect(
    page.getByRole('heading', { name: 'Welcome', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Your account has been created!', { exact: true }),
  ).toBeVisible();

  await verifyEmail(page, { name, email });
}
