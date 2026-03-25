# Workshop Introduction

# main branch

## Refine a spec into Page Object Model via Copilot

### Initial codegen script
Let's start by reviewing `./tests/raw.spec.ts`
It is a simple script that has been recorded via Codegen, it has all the clicks and interactions direct from recording.

If we feed this into the ai without instructions to remove unnecessary steps it will include the clicks which do nothing, but are part of human interaction.
So lets first clean up the script, by reducing it to only the necessary interactions that playwright should do.

`./tests/refined.spec.ts` is a cleaner version of the script, lets design some rules for copilot to use to convert this to a Page Object Model.

### AI Skills

For this process we are going to utilise some pre-written skills which provide context to the ai without overloading it. 

`./.agents/skills/page-object-modelling/SKILL.md` 

This skill describes how we want the Page Object Model to be, what are the core pinciples and rules that we want the ai to adhere to when convert the script to a Page Object Model.

tldr
- 1 class per page
- Locators declared at the top of the page class
- Locators initialised in the constructor
- Actions are broken up into behaviour methods
- Inputs are encapsulated into meaningful objects
- Pages are aggregated into an application class
- Application class is initialised via a test fixture

### Utilising the skills
Copilot will access the skills folder and try to match keywords to the skills and decide which skills to utilise.
By prompting:

```
convert refined.spec.ts to Page object Modelling
```

Copilot will output `Planning page-object modeling task` and begin reading the context we provided to apply it to the script we provided.

### What is missing?
Not everything we want has been added to this skill, there are still some flaws like the username and password being exposed in the test. Another skill we have is the `./.agents/skills/reviewing-page-objects/SKILL.md` which we should populate with out expected standards and practices. We can use this to ensure that a handwritten script or an ai generated script has met our expectations.

That doesn't mean our job is done, we should still review the generated pages, ensure it has created nice reusable codeblocks, and that the locators have not been changed or hallucinated.

Try running the test - does it pass? Often it wont, as the script was generated out of the context of the app and there are issues that the codegen script did not cater for.

In this example if the application isn't locally hosted, even the ~200ms response time of `/api/UserManagement/getSchoolId` will result in a race condition where playwright will act before the app has registered which school is being worked on!


## Reviewing Scripts with Copilot
`./.agents/skills/reviewing-page-objects/SKILL.md`

This skill should have all the must-haves and best practices of your organisation. In the example we are looking at today we have purposefully left some of the best practices out of the page-object-modelling skill to allow the demonstration of the reviewer.

Lets prompt something simple:
```
review my page object model
```

Copilot will output something like `Let me read the review skill and all current POM files simultaneously.` and begin a live code review. 

Summary Table

| # | File | Issue | Severity |
|---|------|-------|----------|
| 1 | All page objects | No base PageObject class / no super(page) | Medium |
| 2 | refined.spec.ts | Hardcoded credentials | High |
| 3 | login-page.ts, students-page.ts | Interface naming missing I prefix | Low |
| 4 | dashboard-page.ts | Assertion inside action method | Medium |
| 5 | students-page.ts | rowLocator is a function property, not a Locator | Medium |

The outcome of our review will look something like this, mostly naming conventions and a missing shared pageobject class which all our pages should inherit.
The high risk is the hard coded credentials - we should be using .env to protect these.

We can ask copilot to apply these fixes for us or make the changes ourselves.

At the time of writing copilot made the change to use dotenv - but it didnt offer to install the library!
This SHOULD be in your project already, but if this is a first time doing automation make sure to install dotenv use it to protect sensitive inputs by adding .env to your .gitignore

[dotenv](https://www.npmjs.com/package/dotenv)
`npm install dotenv`

Uncomment line 7-9 in the playwright.config.ts


