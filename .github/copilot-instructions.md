# Copilot Instructions for e2e-hybrid-automation

## Architecture Overview

**Hybrid Test Automation Framework** with two distinct layers:

### UI Testing Layer (Playwright POM)

- **Page Object Model** with inheritance: `CookieHandler` → `BasePage` → Page Objects
- **Pages**: `HomePage`, `LoginPage`, `CartPage`, `ProductsPage`, `ProductDetailsPage`, `CheckoutPage`
- **Components**: `ProductListComponent`, `OrderConfirmationModalComponent`
- **Fixtures**: `pageFixtures.ts` auto-initializes page objects
- **Test Files**: `tests/cookieConsent.spec.ts`, `tests/ui/registration.spec.ts`, `tests/hybrid/registration.spec.ts`

### API Testing Layer (Service Factory Pattern)

- **Services**: `UserService`, `ProductService`, `BrandService`, `AuthService` extending `BaseService`
- **Factory**: `ServiceFactory` in `common/utils/` creates typed service instances
- **Fixtures**: `apiFixtures.ts` provides individual services and factory
- **Test Files**: `tests/api/user-account.spec.ts`
- **HTTP Transport**: Form-encoded (`application/x-www-form-urlencoded`) configured globally in `playwright.config.ts` via `extraHTTPHeaders`

### Why This Hybrid Structure

- **Separation of Concerns**: UI tests use Playwright directly; API tests use REST services
- **Code Reuse**: Factory pattern ensures consistent API initialization
- **Scalability**: Services extend BaseService for shared functionality
- **Type Safety**: Full TypeScript across both layers
- **Global Auth**: `auth/auth.setup.ts` handles cookie state once, reused across all tests
- **Form-Encoded Requests**: `BaseService.buildFormData()` converts data to URLSearchParams; global header applies to all requests

---

## Critical Developer Workflows

### Test Execution

```bash
npx playwright test                                      # Run all tests
npx playwright test tests/api/user-account.spec.ts      # API user account tests
npx playwright test tests/ui/registration.spec.ts       # User registration flow (UI)
npx playwright test tests/hybrid/                       # Hybrid tests
npx playwright test --debug                             # Debug mode
npx playwright show-report                              # View HTML report
```

### Test Data Generation

Tests use **faker.js** for all data - **zero hardcoded values**:

- `UserDataFactory.generateUser()` - Complete user with faker-generated name, email, address
- `UserDataFactory.generateApiTestUserData()` - Returns API-formatted object with all fields needed for API tests
- `UserDataFactory.generateInvalidCredentials()` - Returns `{ nonexistentEmail, invalidPassword }` for error scenarios
- `UserDataFactory.generateUserWithCustomAddress()` - User with optional address customization
- `AddressBuilder` - Fluent builder for Address objects with sensible faker defaults

### Important: Barrel File Imports (Use These!)

- **UI tests**: `import { test, expect } from '../../fixtures';`
- **API tests**: `import { apiTest, expect } from '../../fixtures';`
- **Pages**: `import { HomePage, LoginPage, LOCATORS } from '../../pages';`
- **Services**: `import { UserService, ProductService } from '../../services';`
- **Test Data**: `import { UserDataFactory, AddressBuilder } from '../../common/testData';`
- **Never import from individual files** - always use barrel files (index.ts)

---

## Project-Specific Patterns

### 1. UI Test Pattern (Page Object Model)

```typescript
import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';

test('user registration', async ({ homePage, loginPage }) => {
  const testUser = UserDataFactory.generateUser();
  await homePage.navigate();
  await homePage.acceptCookiesIfPresent();
  await homePage.navigateToSignupLogin();
  await loginPage.fillSignupForm(testUser);
  await expect(loginPage.accountCreatedText).toBeVisible();
});
```

### 2. API Test Pattern (Single-Method Services)

```typescript
import { apiTest, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';
import { StatusCodes } from 'http-status-codes';

apiTest('create user account', async ({ userService }) => {
  const userData = UserDataFactory.generateApiTestUserData();
  const response = await userService.createUserAccount(userData);

  expect(response.responseCode).toBe(StatusCodes.CREATED);
  expect(response.message).toContain('success');

  await userService.deleteUserAccount(userData.email, userData.password);
});

apiTest('fail with invalid credentials', async ({ userService }) => {
  const { nonexistentEmail, invalidPassword } = UserDataFactory.generateInvalidCredentials();
  const response = await userService.deleteUserAccount(nonexistentEmail, invalidPassword);

  expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);
});
```

**Key Pattern**: Services return parsed JSON response body directly (not raw Response objects). Factory method returns single API-formatted object with all needed fields.

### 3. Form-Encoded API Requests

BaseService provides `buildFormData()` helper for converting request objects to URLSearchParams:

```typescript
// In UserService
async createUserAccount(userData: CreateUserData): Promise<any> {
  const response = await this.request.post(`${this.baseURL}/api/endpoint`, {
    data: this.buildFormData(userData),  // Converts to x-www-form-urlencoded
  });
  return response.json();
}
```

Global `extraHTTPHeaders` in `playwright.config.ts` ensures all requests include `Content-Type: application/x-www-form-urlencoded`.

---

## File Structure & Key Locations

```
auth/
├── auth.setup.ts          # Global setup (handles cookies)
└── .auth/cookies.json     # Cached cookies (gitignored)

common/
├── testData/
│   ├── index.ts                    # 🎯 Barrel file
│   ├── UserDataFactory.ts          # generateUser(), generateApiTestUserData(), generateInvalidCredentials()
│   └── AddressBuilder.ts           # Fluent builder for Address
├── utils/
│   ├── cookieHandler.ts            # Cookie modal handling
│   └── ServiceFactory.ts           # API service factory
└── constants/
    └── index.ts                    # 🎯 API_ENDPOINTS, API_MESSAGES

services/
├── index.ts                 # 🎯 Barrel file (export all services)
├── BaseService.ts          # buildFormData() helper + request context
├── UserService.ts          # createUserAccount(), deleteUserAccount(), updateUserAccount(), getUserAccountByEmail()
├── ProductService.ts
├── BrandService.ts
└── AuthService.ts

pages/
├── index.ts                 # 🎯 Barrel file
├── locators.ts             # All UI selectors as constants
├── BasePage.ts             # acceptCookiesIfPresent() and common methods
├── HomePage.ts, LoginPage.ts, etc.
└── components/
    ├── index.ts            # 🎯 Barrel file
    ├── ProductListComponent.ts
    └── OrderConfirmationModalComponent.ts

fixtures/
├── index.ts                 # 🎯 Barrel file (exports test, apiTest, expect)
├── pageFixtures.ts         # UI test fixtures (page objects)
└── apiFixtures.ts          # API test fixtures (services)

tests/
├── api/
│   └── user-account.spec.ts    # 8 tests: create, delete, update, get + error cases
├── ui/
│   └── registration.spec.ts    # UI tests
├── hybrid/
│   └── registration.spec.ts    # Combined UI+API tests
└── cookieConsent.spec.ts       # UI tests
```

---

## Critical Rules

1. **Barrel Files**: Always import from index.ts, never individual files
   - ❌ `import { HomePage } from '../../pages/HomePage'`
   - ✅ `import { HomePage } from '../../pages'`

2. **Test Data**: Use `UserDataFactory` - no hardcoded values
   - ✅ `const { user, apiData } = UserDataFactory.generateApiTestUserData();`
   - ✅ `const { nonexistentEmail } = UserDataFactory.generateInvalidCredentials();`

3. **API Services**: Return parsed response bodies, not raw Response objects
   - Service methods call `.json()` internally and return the parsed body
   - Tests access response properties directly: `response.responseCode`, `response.message`

4. **Form-Encoded Requests**: Always use `buildFormData()` for POST/PUT/DELETE
   - Global `extraHTTPHeaders` provides `Content-Type` header automatically
   - Helper skips `undefined` values

5. **Circular Dependency Prevention**: Page files use local imports
   - ✅ Pages: `import { BasePage } from './BasePage'` (local)
   - ✅ External: `import { HomePage } from '../pages'` (barrel)

6. **Selectors**: All UI selectors in `pages/locators.ts` as constants
   - Never hardcode selectors in page objects or tests
   - Reference via: `LOCATORS.PAGE_NAME.SELECTOR_NAME`

7. **API Endpoints**: Defined in `common/constants/index.ts`
   - Services use `API_ENDPOINTS` constant from barrel import

8. **API Response Messages**: Centralized in `common/constants/apiMessages.ts`
   - Imported as `API_MESSAGES` in tests
   - Example: `API_MESSAGES.USER.CREATE`, `API_MESSAGES.USER.NOT_FOUND`

---

## Test Status & Commands

```bash
npx playwright test                      # Run all tests
npx playwright test --reporter=line      # Simple output
npx playwright show-report               # HTML report
npx playwright test --debug              # Debug mode
npx eslint .                             # Check linting
```

All tests currently passing ✓
