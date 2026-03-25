import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import StudentsPage from '../pageobjects/students.page.js'

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open()

        await LoginPage.login('user1', 'Password@1234')

        const firstName = 'John';
        const lastName = 'Doe';
        const age = 8;
        const grade = '2';
        await expect($(`h1=School Dashboard`)).toBeExisting();

        await StudentsPage.open();
        await expect(StudentsPage.header).toBeExisting()

        await StudentsPage.addStudent(firstName, lastName, age, grade);
        await expect(StudentsPage.addedToast).toBeExisting();

        const studentRow  = await StudentsPage.findStudentRow(firstName, lastName, age, grade);
        await expect(studentRow).toBeExisting();
    })
})

