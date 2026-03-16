import { expect, Locator, Page } from '@playwright/test';

export interface LoginCredentials {
  username: string;
  password: string;
}

export class LoginPage {
  usernameTextbox: Locator;
  passwordTextbox: Locator;
  submitButton: Locator;
  dashboardHeading: Locator;

  constructor(private readonly page: Page) {
    this.usernameTextbox = page.getByRole('textbox', { name: 'Username' });
    this.passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.dashboardHeading = page.getByRole('heading', { name: 'School Dashboard' });
  }

  async visit() {
    await this.page.goto('/');
  }

  async login(credentials: LoginCredentials) {
    await this.usernameTextbox.fill(credentials.username);
    await this.passwordTextbox.fill(credentials.password);
    await this.submitButton.click();
  }

  async expectLoggedIn() {
    await expect(this.dashboardHeading).toBeVisible();
  }
}
