---
name: page-object-modelling
description: "This skill file defines the standards and patterns for converting Playwright scripts to Page Objects. The Page Object Model (POM) helps organize test code in a maintainable and readable way by grouping Playwright Locators and Actions based on the web pages they interact with."
---


## Instructions
When converting Playwright scripts to Page Objects, follow these core principles:

## Core Principles

### 1. **Locator Declaration**
- Declare all locators at the top of the class as properties
- Use Playwright's `Locator` type for all UI element references
- Locators should be descriptive and reflect their purpose

### 2. **Constructor Initialization**
- Initialize all locators within the constructor
- Accept `Page` object as a constructor parameter
- Extend from a base `PageObject` class if available

### 3. **Action Methods**
- Create methods that represent user behaviors, not individual interactions
- Group related interactions into meaningful actions
- Think in terms of user workflows and processes
- Avoid creating methods for every single click, type, or select

### 4. **Parameter Handling**
- Use interfaces for methods requiring multiple parameters
- Single primitive types (string, number, boolean) can be passed directly
- Interfaces improve maintainability and readability
- Future-proof your methods by allowing easy parameter additions

---

## Page Object Structure

### Standard Template

```typescript
export class LoginPage extends PageObject {
    // 1. Declare Locators at the top
    usernamefield: Locator;
    passwordfield: Locator;
    submitButton: Locator;
    dashboardTitle: Locator;
    
    // 2. Initialize in Constructor
    constructor(page: Page) {
        super(page);        
        this.usernamefield = page.getByLabel(`Username / Usernumber`);
        this.passwordfield = page.getByLabel(`Password`);
        this.submitButton = page.getByRole('button', { name: 'Log In' })
        this.dashboardTitle = page.getByText(`OVERVIEW`);
    }
    
    // 3. Create Action Methods
    async visit() {
        await this.page.goto(`/`);
    }
    
    // Method using an interface for multiple parameters
    async login(credential: ICredential) {
        await this.usernamefield.fill(credential.username);
        await this.passwordfield.fill(credential.password);
        await this.submitButton.click();
    }
    
    async validateLogin() {
        await expect(this.dashboardTitle).toBeVisible();
        const authStatePath = `playwright/.auth/login.json`;
        await this.page.context().storageState({ path: authStatePath });
    }
}

// Interface for encapsulating related parameters
export interface ICredential {
    username: string;
    password: string;
}
```

### Dynamic Locators
For dynamic locators that require parameters, create methods that return a `Locator` based on input.



```typescript   
    export class StudentPage
    {
        rowLocator: (student: StudentDetails) => Locator;

        constructor(private readonly page: Page) {
            this.rowLocator = (student: StudentDetails) =>
            page.getByRole('row', {
                name: `${student.firstName} ${student.lastName} ${student.age} ${student.grade}`,
            });
        }
    }
```

### Key Components

1. **Locators**: UI element references grouped by page
2. **Constructor**: Initialization logic for all locators
3. **Actions**: User behavior methods that combine multiple interactions
4. **Interfaces**: Type-safe parameter objects for complex methods

---

## Application Aggregator Pattern

The Application class serves as a central hub for all page objects, simplifying access and initialization.
This should be initialized once per test and passed around as needed, often via fixtures.

```typescript
export class Application {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    investmentPage: InvestmentPage;
    saveAndInvestPage: SaveAndInvest;
    withdrawalPage: WithdrawalPage;
    request: APIRequestContext;
    
    constructor(page: Page, request: APIRequestContext) {
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.investmentPage = new InvestmentPage(page);
        this.saveAndInvestPage = new SaveAndInvest(page);
        this.withdrawalPage = new WithdrawalPage(page);
        this.request = request;
    }
}
```

### Benefits
- Single point of initialization for all page objects
- Centralized access to pages throughout test suite
- Easy to maintain and extend with new pages
- Supports API request context alongside UI pages

---

## Fixtures Integration

Fixtures provide the cleanest way to use Page Objects by eliminating boilerplate instantiation code.
A Page Object Model needs to be instantiated into a fixture to be easily used across tests.

### Create Custom Fixture

```typescript
import { test as base } from "@playwright/test";
import { Application } from "../pages/application";

type testingFixtures = {
    secureWeb: Application;
};

export const test = base.extend<testingFixtures>({
    secureWeb: async ({ page, request }, use) => {
        await use(new Application(page, request));
    },
});

export { expect } from "@playwright/test";
```

### Usage in Tests

**Without Fixture:**
```typescript
import { test, expect } from '@playwright/test';
import { Application } from '../pages/application';

test('Example test', async ({ page, request }) => {
    const app = new Application(page, request);
    await app.loginPage.login({
        username: process.env.singlePolicyUser,
        password: process.env.generalPassword
    });
});
```

**With Fixture (Preferred):**
```typescript
import { test, expect } from '../fixtures/test_fixture';

test('Example test', async ({ secureWeb }) => {
    await secureWeb.loginPage.login({
        username: process.env.singlePolicyUser,
        password: process.env.generalPassword
    });
});
```

---

## Best Practices

### ✅ DO

- **Group actions by user intent**: Create methods like `login()`, `submitForm()`, `navigateToSettings()`
- **Use meaningful interfaces**: Encapsulate parameters with descriptive interfaces
- **Keep locators DRY**: Define each locator once in the constructor
- **Use semantic locators**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over `getByTestId()`
- **Return Page Objects**: Consider returning page objects from actions for fluent chaining
- **Extend a base class**: Use a common `PageObject` base class for shared functionality
- **Allow locator objects to be public**: Dont mark locators as private so that they can be referenced for assertions
- **Protect sensitive data**: Store data like passwords as environment variables in a .env file

### ❌ DON'T

- **Avoid single-interaction methods**: Don't create `clickSubmit()`, `fillUsername()` for every element
- **Don't mix concerns**: Keep page objects focused on their specific page
- **Don't hardcode test data**: Use parameters or configuration files
- **Don't add assertions everywhere**: Focus on actions; add targeted validation methods
- **Don't expose sensitive data**: Data like passwords should be accessed via environment variables
---

## Conversion Example

### Before (Linear Script)

```typescript
test('User login flow', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log In' }).click();
    await expect(page.getByText('OVERVIEW')).toBeVisible();
});
```

### After (Page Object Pattern)

**Page Object:**
```typescript
export class LoginPage extends PageObject {
    usernamefield: Locator;
    passwordfield: Locator;
    submitButton: Locator;
    dashboardTitle: Locator;
    
    constructor(page: Page) {
        super(page);        
        this.usernamefield = page.getByLabel('Username');
        this.passwordfield = page.getByLabel('Password');
        this.submitButton = page.getByRole('button', { name: 'Log In' });
        this.dashboardTitle = page.getByText('OVERVIEW');
    }
    
    async visit() {
        await this.page.goto('/');
    }
    
    async login(credential: ICredential) {
        await this.usernamefield.fill(credential.username);
        await this.passwordfield.fill(credential.password);
        await this.submitButton.click();
    }
    
    async validateLogin() {
        await expect(this.dashboardTitle).toBeVisible();
    }
}

export interface ICredential {
    username: string;
    password: string;
}
```

**Test:**
```typescript
import { test, expect } from '../fixtures/test_fixture';

test('User login flow', async ({ secureWeb }) => {
    await secureWeb.loginPage.visit();
    await secureWeb.loginPage.login({
        username: 'testuser',
        password: 'password123'
    });
    await secureWeb.loginPage.validateLogin();
});
```

---

## Directory Structure

Recommended organization:

```
tests/
├── fixtures/
│   └── test_fixture.ts       # Custom fixtures
├── pages/
│   ├── application.ts         # Application aggregator
│   ├── base/
│   │   └── page_object.ts     # Base PageObject class
│   ├── login_page.ts
│   ├── dashboard_page.ts
│   └── ...
├── interfaces/
│   └── credentials.ts         # Shared interfaces
└── specs/
    ├── login.spec.ts
    └── ...
```

---

## Summary

The Page Object Model provides:
- **Maintainability**: Changes to UI locators happen in one place
- **Readability**: Tests read like user stories
- **Reusability**: Actions can be shared across multiple tests
- **Scalability**: Easy to add new pages and behaviors
- **Type Safety**: TypeScript interfaces ensure correct usage

When converting scripts to Page Objects, focus on creating meaningful user behaviors rather than one-to-one mappings of UI interactions.
