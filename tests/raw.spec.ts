import { test, expect } from '@playwright/test';


test('Login and create a student, student should be visible in students table after', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('User1');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@1234');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'School Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Students' })).toBeVisible();
  await page.getByRole('link', { name: 'Students' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'FirstName' }).click();
  await page.getByRole('textbox', { name: 'FirstName' }).fill('Student1');
  await page.getByRole('textbox', { name: 'LastName' }).click();
  await page.getByRole('textbox', { name: 'LastName' }).fill('LastName');
  await page.getByRole('spinbutton', { name: 'Age' }).click();
  await page.getByRole('spinbutton', { name: 'Age' }).fill('8');
  await page.getByRole('spinbutton', { name: 'Grade' }).click();
  await page.getByRole('spinbutton', { name: 'Grade' }).fill('2');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('cell', { name: 'Student1' })).toBeVisible();
  await page.getByRole('cell', { name: 'LastName', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'LastName', exact: true })).toBeVisible();
});

test('Raw script for task', async ({ page }) => {
  await page.goto('http://localhost:5001/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('user1');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@1234');
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.getByRole('listitem').filter({ hasText: 'Rollcall' }).click();

  await page.getByRole('link', { name: 'Rollcall' }).click();

  await page.getByRole('row', { name: 'Student1 LastName 8 2' }).getByRole('button', { name: 'Present' }).click();
  await expect(page.getByText('Student - Student1 LastName - marked as present')).toBeVisible();

  await page.getByRole('row', { name: 'Student1 LastName 8 2' }).getByRole('button', { name: 'Absent' }).click();
  await expect(page.getByText('Student - Student1 LastName - marked as absent')).toBeVisible();
});

