// biome-ignore lint/style/noRestrictedImports: This is the only place we should be importing from playwright.
import { expect, mergeTests } from '@playwright/test';
import { authenticatedTest } from './fixtures/authenticated.fixture';

export const test = mergeTests(authenticatedTest);

export { expect };
