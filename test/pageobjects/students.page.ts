import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class StudentsPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get header() {
        return $('h1=Student Management');
    }

    public get addStudentBtn() {
        return $('button=Add');
    }

    public get firstNameInput() {
        return $('#firstName');
    }

    public get lastNameInput() {
        return $('#lastName');
    }

    public get ageInput() {
        return $('#age');
    }

    public get gradeInput() {
        return $('#grade');
    }

    public get submitBtn() {
        return $('button=Submit');
    }

    public get table() {
        return $(`table.table.table-striped.table-bordered`)
    }

    public get addedToast(){
        return $(`div=Student added successfully.`);
    }


    public async addStudent(firstName: string, lastName: string, age: number, grade: string) {
        await this.addStudentBtn.click();
        await this.firstNameInput.setValue(firstName);
        await this.lastNameInput.setValue(lastName);
        await this.ageInput.setValue(age);
        await this.gradeInput.setValue(grade);
        await this.submitBtn.click();
    }

    public async findStudentRow(firstName: string, lastName: string, age: number, grade: string): Promise<WebdriverIO.Element> {
        const expected = [firstName, lastName, age.toString(), grade];
        const table = await this.table;

        const rows = await table.$$('tbody tr');

        let matchRow: WebdriverIO.Element | undefined;
        for (const row of rows) {
            const text = (await row.getText()).toLowerCase();
            if (expected.every(val => text.includes(val.toLowerCase()))) {
                matchRow = row;
                break;
            }
        }

        if (!matchRow) {
            throw new Error(`No row found containing all values: ${expected.join(', ')}`);
        }

        return matchRow;
    }


    /**
     * overwrite specific options to adapt it to page object
     */
    public open() {
        return super.open('students');
    }
}

export default new StudentsPage();
