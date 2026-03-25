import { Page } from '@playwright/test';
import { LoginPage } from './login.page';
import { DashboardPage } from './dashboard.page';
import { StudentsPage } from './students.page';

export class Application {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    studentsPage: StudentsPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.studentsPage = new StudentsPage(page);
    }
}
