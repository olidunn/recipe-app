import type { Page } from '@playwright/test';
import { emailAddress } from '@recipe-app/common';
import { expect } from '~/test';

const emailServer = 'http://localhost:8025';
const emailServerAPI = `${emailServer}/api/v1`;

export async function openEmail(
  page: Page,
  email: string,
  subject: string,
): Promise<void> {
  let messageId: string | undefined;

  await expect
    .poll(
      async () => {
        const searchEmailsResponse = await fetch(
          encodeURI(
            `${emailServerAPI}/search?query=is:unread to:${email} from:${emailAddress.account.email} subject:"${subject}"`,
          ),
        );
        const data = (await searchEmailsResponse.json()) as {
          messages?: { ID: string }[];
        };

        const messages = data.messages || [];
        if (messages[0]) {
          messageId = messages[0].ID;
        }

        return messages;
      },
      {
        intervals: [250, 500, 1000],
        timeout: 30_000,
        message: `Timed out waiting for unread email for ${email} with subject "${subject}"`,
      },
    )
    .toHaveLength(1);

  expect(messageId).toBeTruthy();

  await page.goto(`${emailServer}/view/${messageId}.html`);

  // biome-ignore lint/style/noNonNullAssertion: we have already checked that messageId is truthy
  await deleteEmails([messageId!]);
}

export async function deleteEmails(emailIds: string[]): Promise<void> {
  const deleteResponse = await fetch(`${emailServerAPI}/messages`, {
    method: 'DELETE',
    body: JSON.stringify({ IDs: emailIds }),
  });
  expect(deleteResponse.ok).toBe(true);
}

export async function clickLink(
  page: Page,
  text: string,
  pathPattern: RegExp,
): Promise<void> {
  const linkLocator = page.getByRole('link', {
    name: text,
    exact: true,
  });
  await expect(linkLocator).toBeVisible();
  const link = await linkLocator.getAttribute('href');
  expect(link).toBeTruthy();
  expect(link).toMatch(pathPattern);

  await linkLocator.click();
  // biome-ignore lint/style/noNonNullAssertion: we have already checked that link is truthy
  await expect(page).toHaveURL(link!);
}
