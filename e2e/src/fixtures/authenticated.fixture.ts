import type { Page } from '@playwright/test';
// biome-ignore lint/style/noRestrictedImports: This is the only place we should be importing from playwright.
import { test } from '@playwright/test';
import type { CreateUserRequest, LoginRequest } from '@recipe-app/common';
import { to } from '@recipe-app/common';
import { getServer, SERVER_URL } from '~/helpers/server';
import {
  createAccount,
  createUniqueTestUser,
} from '~/helpers/users/create-account';

export type TestUser = Omit<CreateUserRequest, 'confirmedPassword'>;

type TestFixture = {
  user: TestUser;
  loggedInPage: Page;
};

export const authenticatedTest = test.extend<TestFixture>({
  /**
   * Creates and deletes a user account automatically for each test.
   */
  user: async ({ browser }, use, testInfo) => {
    const user = createUniqueTestUser(testInfo);

    const setupPage = await browser.newPage();
    await createAccount(setupPage, user);
    await setupPage.close();

    await use(user);

    const teardownPage = await browser.newPage();
    await deleteAccountAPI(teardownPage, {
      email: user.email,
      password: user.password,
    });
    await teardownPage.close();
  },

  /**
   * Logs in the user automatically for each test.
   */
  loggedInPage: async ({ page, user }, use) => {
    await loginAPI(page, {
      email: user.email,
      password: user.password,
    });
    await page.goto(to('/recipes'));
    await use(page);
  },
});

async function loginAPI(page: Page, data: LoginRequest): Promise<boolean> {
  const loginResponse = await page.request.post(`${SERVER_URL}/users/login`, {
    data,
  });

  return loginResponse.ok();
}

async function deleteAccountAPI(page: Page, data: LoginRequest): Promise<void> {
  const loggedIn = await loginAPI(page, data);

  if (!loggedIn) {
    // biome-ignore lint/suspicious/noConsole: For debugging
    console.error('Login failed, was the account mutated by a test?');
    return;
  }

  const server = await getServer(page);
  const { error } = await server.users['delete-account'].delete();

  if (error) {
    // biome-ignore lint/suspicious/noConsole: For debugging
    console.error(`Delete account failed: ${error.status}`);
  }
}
