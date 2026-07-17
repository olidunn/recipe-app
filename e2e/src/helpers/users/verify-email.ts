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

  await expect(
    page.getByRole('heading', { name: 'One last step!', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Click the button below to verify your email address.', {
      exact: true,
    }),
  ).toBeVisible();

  const verifyButton = page.getByRole('button', {
    name: 'Verify email address',
    exact: true,
  });
  await expect(verifyButton).toBeVisible();
  await verifyButton.click();

  await expect(
    page.getByRole('heading', { name: "Let's go!", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByText('Your email address has been verified.'),
  ).toBeVisible();
  const loginLink = page.getByRole('link', { name: 'log in', exact: true });
  await expect(loginLink).toBeVisible();

  await loginLink.click();

  await expect(page).toHaveURL(to('/login'));
}
