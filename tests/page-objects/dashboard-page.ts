import { Locator, Page } from '@playwright/test';
import { PageObject } from './page-object';

export class DashboardPage extends PageObject {
  studentsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.studentsLink = page.getByRole('link', { name: 'Students' });
  }

  async openStudents() {
    await this.studentsLink.click();
  }
}
