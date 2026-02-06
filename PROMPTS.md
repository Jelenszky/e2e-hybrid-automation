# Prompt Documentation: AI vs Manual Approaches

This file documents, for each major feature, whether the solution was developed using AI (Copilot), manual coding, or a combination, along with the reasoning behind each choice.

## Project Structure & Architecture

**Approach:** Manual

**Reasoning:**
The entire project structure was designed and organized manually based on a my architectural vision:

- **Test Layer Separation:** API tests isolated from UI/Hybrid tests (no shared setup, independent execution)
- **Configuration Strategy:** Multi-project approach in `playwright.config.ts` with project-level dependencies
- **Setup Flow:** Setup project runs once before UI/Hybrid tests; conditional `storageState` loading for CI resilience
- **Service Layer:** Factory pattern with `BaseService` to provide consistent HTTP transport and type safety across all API services
- **Test Data Strategy:** Centralized factories (`UserDataFactory`, `AddressBuilder`) ensuring zero hardcoded values
- **Code Organization:** Barrel file pattern (`index.ts`) in each module for clean, maintainable imports

---

## Test Case Generation & Scenario Coverage

**Approach:** AI-assisted

**Reasoning:**

- **Exploration Foundation:** Used POMs to thoroughly explore the application's features and user workflows
- **API Documentation Analysis:** Leveraged API documentation to understand endpoints, request/response formats, and business logic
- **AI-assisted Test Case Generation:** Copilot was used to:
  - Generate test scenarios based on API documentation and application behavior
  - Identify edge cases and negative test cases (invalid credentials, malformed requests, boundary conditions)
- **Scenarios Covered:** CRUD operations, field validation, error responses, authentication flows, data isolation, concurrent operations

---

## Service Layer & Factory Pattern

**Approach:** Manual architecture with AI-assisted refinement

**Reasoning:**

- **Manual:** Designed service factory pattern to eliminate service instantiation boilerplate
- **Services:** `UserService`, `ProductService`, `BrandService`, `AuthService` all extend `BaseService`
- **BaseService:** Provides `buildFormData()` helper for form-encoded requests; manages request context
- **ServiceFactory:** Creates typed instances with automatic `extraHTTPHeaders` for form encoding
- **AI-assisted:** Copilot helped refactor service layer

---

## Code Organization & Barrel Imports

**Approach:** Manual structure with AI-assisted enforcement

**Reasoning:**

- **Manual:** Established barrel file pattern (`index.ts` in each directory) to centralize exports
- **AI-assisted:** Copilot ensured consistency and helped identify circular dependency issues

---

## Page Object Model (POM)

**Approach:** AI-generated scaffolding with extensive manual selector refinement

**Reasoning:**

- **AI-generated (Playwright MCP Agent):** The initial POM structure, page objects, and selector scaffolding were generated using Playwright's MCP agent to establish the foundation
- **Manual Selector Refinement:** Extensive manual work was required to:
  - Identify and prioritize `data-qa` attributes in HTML for more reliable, semantic selectors
  - Simplify auto-generated selectors that were overly complex or fragile

---

## Schema Validation & Optional Fields

**Approach:** Manual analysis

**Reasoning:**

- **Manual:** Analyzed API responses to identify field mapping quirks (`firstname` → `first_name`, `birth_date` → `birth_day`)
- **Manual:** Identified optional fields (`company`, `address2`, `mobile_number`) that should not be required in schema

---

## Complete Type Safety

**Approach:** Manual systematic refactoring with AI assistance

**Reasoning:**

- **Manual:** Audited codebase to identify all `any` types and informal interfaces
- **AI-assisted:** Copilot helped verify type consistency across service layer and test files

---

## Ad Blocking via Network Interception

**Approach:** AI-assisted discovery and implementation

**Reasoning:** Google Vignette ads were causing test flakiness. Rather than working around intermittent failures:

- Copilot suggested network-level blocking using Playwright's `page.route()` API
- Routes were extracted to constants for maintainability
- Solution was integrated into `BasePage.navigate()` to run once per test

---

## GitHub Actions Integration & Sharding

**Approach:** Both AI-assisted and manual

**Reasoning:** The base pipeline was set up manually based on GH actions pipelines previously set up for a pet project, but Copilot was used to improve it.

---

## Tooling Integration (faker.js, ESLint, Prettier, Husky, Allure)

**Approach:** AI-assisted

**Reasoning:** Integration of faker.js for dynamic test data, as well as ESLint, Prettier, Husky for code quality and pre-commit checks, and Allure reporting, was guided by Copilot. AI provided configuration suggestions and helped resolve setup issues efficiently.

---

## Reflection

### When AI Was Most Valuable

- **Architectural perspective:** POM base structure generation, service layer consolidation
- **Boilerplate reduction:** Form data handling, test fixture setup
- **Implementation guidance:** Zod schema syntax, faker.js integration, GitHub Actions workflows
- **Consistency checks:** Type safety audits, locator selector options, path resolution approaches
- **Test case generation:** Creating scenarios and edge cases based on API documentation and application exploration

### When Manual Coding Was Preferred

- **Project architecture decisions:** Initial project setup, domain-specific logic, separating API from UI/Hybrid tests, choosing setup project approach over globalSetup
- **Domain-specific logic:** Test data generation strategy, API type and field mapping, cookie handling flow
- **Critical decision-making, when precise control was needed**
