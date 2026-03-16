import { test as base, expect } from '@playwright/test';
import { Application } from '../page-objects/application';

type TestFixtures = {
  app: Application;
};

export const test = base.extend<TestFixtures>({
  app: async ({ page }, use) => {
    await use(new Application(page));
  },
});

export { expect };
