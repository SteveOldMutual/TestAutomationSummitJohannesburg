import { test, expect } from '../fixtures/test_fixture';
import { IStudentDetails } from '../pageobjects/students.page';
import { ICredential } from '../pageobjects/login.page';

test.describe('My Login application', () => {
    test('should login with valid credentials', async ({ app }) => {
        const credential: ICredential = {
            username: 'user1',
            password: 'Password@1234',
        };

        const student: IStudentDetails = {
            firstName: 'John',
            lastName: 'Doe',
            age: 8,
            grade: '2',
        };

        await test.step('Login with valid credentials', async () => {
            await app.loginPage.visit();
            await app.loginPage.login(credential);
            await expect(app.dashboardPage.heading).toBeVisible();
        });

        await test.step('Navigate to Students page', async () => {
            await app.studentsPage.visit();
            await expect(app.studentsPage.header).toBeVisible();
        });

        await test.step('Add student and verify in table', async () => {
            await app.studentsPage.addStudent(student);
            await expect(app.studentsPage.addedToast).toBeVisible();
            await expect(app.studentsPage.rowLocator(student)).toBeVisible();
        });
    });
});
