---
name: review-page-objects
description: This skill file defines the review criteria and best practices for auditing existing Playwright Page Object Models and test files. Use this checklist to ensure code quality, maintainability, and adherence to Playwright best practices.
---

## Instructions
You are a code reviewer specializing in Playwright Page Object Models and test files. When reviewing code, use the following checklist to identify issues, suggest improvements, and ensure adherence to best practices. Focus on maintainability, readability, reliability, and testability of the code.

Aswell as the guidelines in this file, also review against the standards defined in the `page-object-modelling` skill file. If you identify any issues that are already covered by that skill, reference it in your feedback.

Also refer to the `playwright-best-practices` skill file for general Playwright coding standards. If you see any violations of those best practices, flag them and provide corrections.

## Review Checklist for Page Objects (**/pages/**/*.ts)

### 1. **File Structure and Naming**

#### ✅ Check For:
- Files should be in a `pages/` folder (or similar name like `page-objects/`)
- Page object files should follow naming convention: `{pagename}_page.ts` (e.g., `login_page.ts`, `dashboard_page.ts`)
- Subfolders can be used to organize related pages

#### ❌ Issues to Flag:
- Inconsistent naming conventions
- Page objects not in a dedicated folder
- Generic names that don't reflect the page (e.g., `page1.ts`, `test.ts`)

---

### 2. **Class Structure**

#### ✅ Required Structure (in order):
```typescript
export class LoginPage extends PageObject {
    // 1. Locator declarations
    usernameField: Locator;
    passwordField: Locator;
    
    // 2. Constructor
    constructor(page: Page) {
        super(page);
        this.usernameField = page.getByLabel('Username');
        this.passwordField = page.getByLabel('Password');
    }
    
    // 3. Behavior methods
    async login(credentials: ICredential) {
        await this.usernameField.fill(credentials.username);
        await this.passwordField.fill(credentials.password);
    }
}
```

#### ❌ Issues to Flag:
- Methods defined before locators
- Locators not declared at the top of the class
- Constructor not present or missing super(page) call

---

### 3. **Locator Quality**

#### ✅ Preferred Approach:
- Use Playwright's `.getBy` methods:
  - `getByRole()` ⭐ Best for accessibility
  - `getByLabel()` ⭐ Great for form fields
  - `getByText()` ⭐ Good for static content
  - `getByPlaceholder()` ⭐ For input placeholders
  - `getByTestId()` ⭐ Last resort but reliable

#### ⚠️ Warning:
- **XPath selectors**: Prompt user that this might not be the best approach
  - XPaths are brittle and hard to maintain
  - Suggest refactoring to `.getBy` methods

#### ❌ Issues to Flag:
- CSS selectors without `.getBy` method
- Locators declared as `any` type - must be `Locator` type
- Missing `Locator` import from `@playwright/test`

**Example Issue:**
```typescript
// ❌ Bad
someField: any;
constructor(page: Page) {
    this.someField = page.locator('input[name="field"]');
}

// ✅ Good
someField: Locator;
constructor(page: Page) {
    this.someField = page.getByLabel('Field Name');
}
```

---

### 4. **Behavior Methods vs Atomic Actions**

#### ✅ Methods Should Be Behaviors:
Methods should represent **user behaviors** and **workflows**, not individual clicks or fills.

**Good Examples:**
- `login(credentials: ICredential)`
- `searchForProduct(productName: string)`
- `completeCheckout(orderDetails: IOrderDetails)`
- `addStudentToClass(student: IStudent)`

**Bad Examples (Atomic Actions):**
- `clickSubmitButton()`
- `fillUsername(username: string)`
- `selectDropdownOption(option: string)`

#### 🔍 Review Trigger:
**If a method is only one line, prompt the user:**
> "This method appears to be one line. Is this correct? Remember that methods should represent user behaviors rather than atomic actions. Consider grouping related actions together."

#### 💡 Suggestion:
If you see multiple atomic actions that are thematic, suggest grouping them:

```typescript
// ❌ Bad - Atomic actions
async fillFirstName(name: string) {
    await this.firstNameField.fill(name);
}

async fillLastName(name: string) {
    await this.lastNameField.fill(name);
}

async fillEmail(email: string) {
    await this.emailField.fill(email);
}

// ✅ Good - Behavior
async fillContactInformation(contact: IContactInfo) {
    await this.firstNameField.fill(contact.firstName);
    await this.lastNameField.fill(contact.lastName);
    await this.emailField.fill(contact.email);
}
```

---

### 5. **Action Chaining**

#### ✅ Correct Approach:
Actions should be chained off established locators, not using page selectors directly.

```typescript
// ✅ Good - Using declared locator
usernameField: Locator;

constructor(page: Page) {
    super(page);
    this.usernameField = page.getByLabel('Username');
}

async enterUsername(username: string) {
    await this.usernameField.fill(username);
}
```

#### ❌ Always Flag This:
```typescript
// ❌ Bad - Direct page selector in method
async enterUsername(username: string) {
    await this.page.fill('input[name="username"]', username);
}

// ❌ Bad - Locator created in method
async enterUsername(username: string) {
    await this.page.getByLabel('Username').fill(username);
}
```

**Correction:** All locators should be declared as class properties and initialized in the constructor.

---

### 6. **Method Parameters**

#### ✅ Use Interfaces for Multiple Parameters:
When a method requires multiple primitive parameters, encapsulate them in an interface.

```typescript
// ❌ Bad - Many primitive parameters
async createUser(firstName: string, lastName: string, email: string, age: number, role: string) {
    // ...
}

// ✅ Good - Interface encapsulation
async createUser(user: IUserDetails) {
    await this.firstNameField.fill(user.firstName);
    await this.lastNameField.fill(user.lastName);
    await this.emailField.fill(user.email);
    await this.ageField.fill(user.age.toString());
    await this.roleDropdown.selectOption(user.role);
}

export interface IUserDetails {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    role: string;
}
```

#### 💡 Review Threshold:
- **2+ parameters**: Consider suggesting an interface
- **3+ parameters**: Strongly recommend an interface

---

### 7. **URL Handling**

#### ❌ Flag Full URLs:
```typescript
// ❌ Bad - Full URL won't work in other environments
async visit() {
    await this.page.goto('https://example.com/login');
}
```

#### ✅ Use Relative Paths with BaseURL:
```typescript
// ✅ Good - Relative path
async visit() {
    await this.page.goto('/login');
}
```

**Reminder to User:**
> "Found full URL in page object. This won't work against other environments. Use a relative path and configure `baseURL` in `playwright.config.ts`:
> ```typescript
> export default defineConfig({
>   use: {
>     baseURL: 'https://example.com',
>   },
> });
> ```"

---

### 8. **Waiting and Assertions**

#### ❌ Flag Deprecated Patterns:
```typescript
// ❌ Bad - waitForDisplayed is deprecated
await this.submitButton.waitForDisplayed();

// ❌ Bad - Manual waiting
await this.page.waitFor(5000);
```

#### ✅ Remind User:
> "Use Playwright's Web-First Assertions instead. Playwright has built-in auto-waiting. You don't need manual waits in most cases."

```typescript
// ✅ Good - Web-First Assertion
await expect(this.submitButton).toBeVisible();

// ✅ Good - Auto-waiting action
await this.submitButton.click(); // Playwright waits automatically
```

#### ✅ Valid Exception:
```typescript
// ✅ Valid - Waiting for async data load
await this.page.waitForLoadState('networkidle');
```

#### 💡 Note About Assertions in Pages:
> "Web-First Assertions are not required in page objects. They can be used directly in spec files for cleaner separation of concerns."

---

### 9. **Code Cleanliness**

#### ❌ Always Flag:
- Commented-out code
- Console.log statements
- Unused imports
- Dead code

**Reminder:**
> "Remove commented-out code. Comments should be for documentation, not storing old code. Use version control for code history."

```typescript
// ❌ Bad
async login(credentials: ICredential) {
    await this.usernameField.fill(credentials.username);
    // await this.page.waitFor(2000);
    await this.passwordField.fill(credentials.password);
    // console.log('Logging in...');
    await this.submitButton.click();
}

// ✅ Good
async login(credentials: ICredential) {
    await this.usernameField.fill(credentials.username);
    await this.passwordField.fill(credentials.password);
    await this.submitButton.click();
}
```

---

### 10. **Page Aggregation**

#### ✅ Check for Application Aggregator:
All pages should be aggregated into a single Application class.

```typescript
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
```

#### 🔍 Review Task:
- Check if an aggregator class exists (usually `application.ts` or `app.ts`)
- Verify that the page being reviewed is included in the aggregator
- If missing, prompt user to add it

#### 💡 Pages Can Be Instantiated in Other Pages:
It's acceptable for one page to instantiate another page object if needed for navigation flows.

---

## Review Checklist for Tests (**/tests/**/*.spec.ts)

### 1. **Test Structure (AAA Pattern)**

#### ✅ Required Pattern:
Tests should follow the **Arrange-Act-Assert** pattern:

```typescript
test('User can create a new student', async ({ app }) => {
    // Arrange - Setup data
    const newStudent = {
        firstName: 'John',
        lastName: 'Doe',
        age: 10,
        grade: 5
    };
    
    // Act - Perform actions
    await app.studentsPage.addNewStudent(newStudent);
    
    // Assert - Verify outcome
    await expect(app.studentsPage.studentNameCell).toContainText('John Doe');
});
```

---

### 2. **Assertions Required**

#### ❌ Always Flag:
Tests without `expect()` or assertions.

```typescript
// ❌ Bad - No assertion
test('Login test', async ({ app }) => {
    await app.loginPage.login({ username: 'user', password: 'pass' });
});

// ✅ Good - Has assertion
test('Login test', async ({ app }) => {
    await app.loginPage.login({ username: 'user', password: 'pass' });
    await expect(app.dashboardPage.welcomeMessage).toBeVisible();
});
```

---

### 3. **Abstraction Level**

#### ✅ Tests Should Be High-Level:
Tests should read like user stories, not implementation details.

```typescript
// ❌ Bad - Implementation details exposed
test('Create student', async ({ page }) => {
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByRole('button', { name: 'Submit' }).click();
});

// ✅ Good - Abstracted behind Page Objects
test('Create student', async ({ app }) => {
    await app.studentsPage.addNewStudent({
        firstName: 'John',
        lastName: 'Doe',
        age: 10,
        grade: 5
    });
    await expect(app.studentsPage.studentTable).toContainText('John Doe');
});
```

#### 💡 Exception:
`expect()` statements can be in tests - they are assertions, not implementation details.

---

### 4. **Fixture Usage**

#### ✅ Use Test Fixtures:
Tests should use custom fixtures, not instantiate page objects directly.

```typescript
// ❌ Bad - Instantiating in test
import { test } from '@playwright/test';
import { Application } from '../pages/application';

test('Example', async ({ page }) => {
    const app = new Application(page);
    await app.loginPage.login({ username: 'user', password: 'pass' });
});

// ✅ Good - Using fixture
import { test } from '../fixtures/test_fixture';

test('Example', async ({ app }) => {
    await app.loginPage.login({ username: 'user', password: 'pass' });
});
```

#### ❌ Always Flag:
- Direct instantiation of Page Objects in tests
- Direct instantiation of Application aggregator in tests
- Using `new LoginPage(page)` or similar in test files

---

### 5. **No Direct Page Access**

#### ❌ Flag Direct Page Usage:
Tests should only use the page aggregator via fixture.

```typescript
// ❌ Bad - Direct page usage
test('Login', async ({ page, app }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('user');
    // ...
});

// ✅ Good - Only use aggregator
test('Login', async ({ app }) => {
    await app.loginPage.visit();
    await app.loginPage.login({ username: 'user', password: 'pass' });
});
```

### 6. ** Test Step Usage**
Tests should use `test.step()` to logically group actions and assertions for better readability and reporting.
Test steps are used to align with our Xray reporting, so that each step is visible in the test execution report.
Each step should represent a meaningful user action or verification point.
Each step should be failable.

```typescript
    test('Create student', async ({ app }) => {
      await test.step('Add new student', async () => {
          await app.studentsPage.addNewStudent({
              firstName: 'John',
              lastName: 'Doe',
              age: 10,
              grade: 5
          });

        await expect(app.studentsPage.studentTable).toContainText('John Doe');
    });
});
```

If test does not have test steps remind the user to add them for better reporting, readability, and that without them their tests may not be included in reporting metrics.

---

## Quick Reference Summary

### Page Objects
| Check | Issue | Solution |
|-------|-------|----------|
| Locator Type | `any` type | Use `Locator` type |
| Locator Declaration | In methods | Declare at top, initialize in constructor |
| Actions | `await this.page.fill()` | Chain off declared locators |
| Methods | One-liner/atomic | Group into behaviors |
| Parameters | Many primitives | Use interface |
| URLs | Full URLs | Use relative paths + baseURL |
| Waiting | `waitForDisplayed()` | Use Web-First Assertions or auto-wait |
| XPath | Used | Suggest `.getBy` methods |
| Code | Commented out | Remove |
| Aggregation | Page not in app class | Add to aggregator |

### Tests
| Check | Issue | Solution |
|-------|-------|----------|
| Assertions | Missing `expect()` | Add assertion |
| Structure | No AAA pattern | Arrange → Act → Assert |
| Abstraction | Implementation details | Use Page Object methods |
| Instantiation | `new Application()` | Use fixture |
| Page Usage | Direct `page` usage | Use aggregator only |

---

## Review Workflow

1. **Identify file type** (page object vs test spec)
2. **Run through relevant checklist** systematically
3. **Flag issues** with specific examples
4. **Provide corrections** with code samples
5. **Explain the "why"** behind each recommendation
6. **Prioritize critical issues** (type safety, direct selectors) over style issues

---

## Example Review Output

When reviewing code, structure feedback like this:

### 🔴 Critical Issues
- Locators using `any` type instead of `Locator`
- Actions not chained off declared locators
- Full URLs instead of relative paths

### 🟡 Improvements Recommended
- One-line methods - consider grouping into behaviors
- Multiple primitive parameters - use interface
- Missing from Application aggregator

### 🟢 Best Practices
- Good use of `.getBy` methods
- Proper AAA pattern in tests
- Using fixtures correctly

---

## Summary

This review skill ensures:
- **Type Safety**: Proper use of `Locator` types
- **Maintainability**: Behaviors over atomic actions
- **Reliability**: `.getBy` methods over fragile selectors
- **Testability**: Clean separation between tests and implementation
- **Flexibility**: BaseURL configuration for multiple environments
- **Readability**: Tests that read like user stories