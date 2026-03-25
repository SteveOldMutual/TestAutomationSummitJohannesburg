import { Locator, Page } from '@playwright/test';
import { PageObject } from './page';

export interface IStudentDetails {
    firstName: string;
    lastName: string;
    age: number;
    grade: string;
}

export class StudentsPage extends PageObject {
    header: Locator;
    addStudentBtn: Locator;
    firstNameInput: Locator;
    lastNameInput: Locator;
    ageInput: Locator;
    gradeInput: Locator;
    submitBtn: Locator;
    addedToast: Locator;
    rowLocator: (student: IStudentDetails) => Locator;

    constructor(page: Page) {
        super(page);
        this.header = page.getByRole('heading', { name: 'Student Management' });
        this.addStudentBtn = page.getByRole('button', { name: 'Add' });
        this.firstNameInput = page.getByLabel('First Name');
        this.lastNameInput = page.getByLabel('Last Name');
        this.ageInput = page.getByLabel('Age');
        this.gradeInput = page.getByLabel('Grade');
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.addedToast = page.getByText('Student added successfully.');
        this.rowLocator = (student: IStudentDetails) =>
            page.getByRole('row', {
                name: `${student.firstName} ${student.lastName} ${student.age} ${student.grade}`,
            });
    }

    async visit() {
        await this.page.goto('/students');
    }

    async addStudent(student: IStudentDetails) {
        await this.addStudentBtn.click();
        await this.firstNameInput.fill(student.firstName);
        await this.lastNameInput.fill(student.lastName);
        await this.ageInput.fill(student.age.toString());
        await this.gradeInput.fill(student.grade);
        await this.submitBtn.click();
    }
}
