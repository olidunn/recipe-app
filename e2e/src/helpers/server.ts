import { treaty } from '@elysiajs/eden';
import type { Page } from '@playwright/test';
import type { Server } from '@recipe-app/server';

export const SERVER_URL = 'http://localhost:8787';

export function getServer(cookie: string) {
  return treaty<Server>(SERVER_URL, {
    fetch: { credentials: 'include', mode: 'cors' },
    headers: {
      cookie,
    },
  });
}

export async function getCookieHeader(page: Page): Promise<string> {
  const cookies = await page.context().cookies();

  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
}
