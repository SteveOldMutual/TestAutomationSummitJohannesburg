import { Locator, Page } from '@playwright/test';
import { PageObject } from './page';

export class DashboardPage extends PageObject {
    heading: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'School Dashboard' });
    }
}
