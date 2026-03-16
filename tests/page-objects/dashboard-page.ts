import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  studentsLink: Locator;

  constructor(private readonly page: Page) {
    this.studentsLink = page.getByRole('link', { name: 'Students' });
  }

  async openStudents() {
    await expect(this.studentsLink).toBeVisible();
    await this.studentsLink.click();
  }
}
