import { test as base } from '@playwright/test';
import { Application } from '../pageobjects/application';

type Fixtures = {
    app: Application;
};

export const test = base.extend<Fixtures>({
    app: async ({ page }, use) => {
        await use(new Application(page));
    },
});

export { expect } from '@playwright/test';
