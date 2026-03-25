import { Locator, Page } from '@playwright/test';
import { PageObject } from './page';

export interface ICredential {
    username: string;
    password: string;
}

export class LoginPage extends PageObject {
    usernameInput: Locator;
    passwordInput: Locator;
    submitButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByLabel('Username');
        this.passwordInput = page.getByLabel('Password');
        this.submitButton = page.getByRole('button', { name: 'Login' });
    }

    async visit() {
        await this.page.goto('/login');
    }

    async login(credential: ICredential) {
        await this.usernameInput.fill(credential.username);
        await this.passwordInput.fill(credential.password);
        await this.submitButton.click();
    }
}
