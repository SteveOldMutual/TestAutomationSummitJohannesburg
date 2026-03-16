import { test, expect } from './fixtures/test-fixture';


test('Login and create a student, student should be visible in students table after', async ({ app }) => {
  const student = {
    firstName: 'Student1',
    lastName: 'LastName',
    age: '8',
    grade: '2',
  };

  await app.loginPage.visit();
  await app.loginPage.login({ username: process.env.APP_USERNAME!, password: process.env.APP_PASSWORD! });
  await app.loginPage.expectLoggedIn();

  await app.dashboardPage.openStudents();
  await app.studentsPage.addStudent(student);
  await app.studentsPage.expectStudentInTable(student);
 
});
