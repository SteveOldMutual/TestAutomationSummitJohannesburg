import { expect, Locator, Page } from '@playwright/test';

export interface StudentDetails {
    firstName: string;
    lastName: string;
    age: string;
    grade: string;
}

export class StudentsPage {
    addButton: Locator;
    firstNameTextbox: Locator;
    lastNameTextbox: Locator;
    ageSpinbutton: Locator;
    gradeSpinbutton: Locator;
    submitButton: Locator;
    rowLocator: (student: StudentDetails) => Locator;

    constructor(private readonly page: Page) {
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.firstNameTextbox = page.getByRole('textbox', { name: 'FirstName' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'LastName' });
        this.ageSpinbutton = page.getByRole('spinbutton', { name: 'Age' });
        this.gradeSpinbutton = page.getByRole('spinbutton', { name: 'Grade' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.rowLocator = (student: StudentDetails) =>
            page.getByRole('row', {
                name: `${student.firstName} ${student.lastName} ${student.age} ${student.grade}`,
            });
    }

    async addStudent(student: StudentDetails) {
        await this.addButton.click();
        await this.firstNameTextbox.fill(student.firstName);
        await this.lastNameTextbox.fill(student.lastName);
        await this.ageSpinbutton.fill(student.age);
        await this.gradeSpinbutton.fill(student.grade);
        await this.submitButton.click();
    }

    async expectStudentInTable(student: StudentDetails) {
        await expect(this.rowLocator(student)).toBeVisible();
    }
}
