import { expect, Locator, Page } from '@playwright/test';
import { PageObject } from './page-object';

export interface IStudentDetails {
    firstName: string;
    lastName: string;
    age: string;
    grade: string;
}

export class StudentsPage extends PageObject {
    addButton: Locator;
    firstNameTextbox: Locator;
    lastNameTextbox: Locator;
    ageSpinbutton: Locator;
    gradeSpinbutton: Locator;
    submitButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.firstNameTextbox = page.getByRole('textbox', { name: 'FirstName' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'LastName' });
        this.ageSpinbutton = page.getByRole('spinbutton', { name: 'Age' });
        this.gradeSpinbutton = page.getByRole('spinbutton', { name: 'Grade' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    private studentRow(student: IStudentDetails): Locator {
        return this.page.getByRole('row', {
            name: `${student.firstName} ${student.lastName} ${student.age} ${student.grade}`,
        });
    }

    async addStudent(student: IStudentDetails) {
        await this.addButton.click();
        await this.firstNameTextbox.fill(student.firstName);
        await this.lastNameTextbox.fill(student.lastName);
        await this.ageSpinbutton.fill(student.age);
        await this.gradeSpinbutton.fill(student.grade);
        await this.submitButton.click();
    }

    async expectStudentInTable(student: IStudentDetails) {
        await expect(this.studentRow(student)).toBeVisible();
    }
}
