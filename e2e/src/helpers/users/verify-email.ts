import type { Page } from '@playwright/test';
import { to } from '@recipe-app/common';
import { expect } from '~/test';
import { clickLink, openEmail } from '../email';

export async function verifyEmail(
  page: Page,
  { name, email }: { name: string; email: string },
): Promise<void> {
  await openEmail(page, email, 'Verify your email');

  expect(page.getByText(`Hey ${name}!`)).toBeVisible();

  await clickLink(page, 'Verify your email address', /\/verify-email\/.+/);

  const verifyButton = page.getByRole('button', {
    name: 'Verify Email',
    exact: true,
  });
  await verifyButton.click();

  await expect(
    page.getByRole('heading', { name: 'Email Verified!', exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText('Your email has been successfully verified.'),
  ).toBeVisible();
  const loginLink = page.getByRole('link', { name: 'Log In', exact: true });
  await expect(loginLink).toBeVisible();

  await loginLink.click();

  await expect(page).toHaveURL(to('/login'));
}
