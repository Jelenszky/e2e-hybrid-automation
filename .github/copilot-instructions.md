# Copilot Instructions for e2e-hybrid-automation

## Architecture Overview

**Hybrid Test Automation Framework** with two distinct layers:

### UI Testing Layer (Playwright POM)

- **Page Object Model** with inheritance: `CookieHandler` → `BasePage` → Page Objects
- **Pages**: `HomePage`, `LoginPage`, `CartPage`, `ProductsPage`, `ProductDetailsPage`, `CheckoutPage`
- **Components**: `ProductListComponent`, `OrderConfirmationModalComponent`
- **Fixtures**: `pageFixtures.ts` auto-initializes page objects
- **Test Files**: `tests/cookieConsent.spec.ts`, `tests/ui/registration.spec.ts`

### API Testing Layer (Service Factory Pattern)

- **Services**: `ProductService`, `BrandService`, `AuthService`, `UserService` extending `BaseService`
- **Factory**: `ServiceFactory` in `common/utils/` creates typed service instances
- **Fixtures**: `apiFixtures.ts` provides both individual services and factory
- **Test Files**: `tests/api/example.api.spec.ts`

### Why This Hybrid Structure

- **Separation of Concerns**: UI tests use Playwright directly; API tests use REST services
- **Code Reuse**: Factory pattern ensures consistent API initialization
- **Scalability**: Services extend BaseService for shared functionality
- **Type Safety**: Full TypeScript across both layers
- **Global Auth**: `auth/auth.setup.ts` handles cookie state once, reused across all tests

---

## Critical Developer Workflows

### Test Execution

```bash
npx playwright test                                      # Run all tests
npx playwright test tests/cookieConsent.spec.ts         # Cookie consent tests
npx playwright test tests/ui/registration.spec.ts       # User registration flow (UI)
npx playwright test tests/api/                          # API tests only
npx playwright test --debug                             # Debug mode
npx playwright show-report                              # View HTML report
```

### Test Data Generation

Tests use **faker.js** for all data:

- `UserDataFactory.generateUser()` - Complete user with faker-generated name, email, address
- `UserDataFactory.generateUserWithCustomAddress()` - User with optional address customization
- `AddressBuilder` - Fluent builder for Address objects with sensible faker defaults

**Zero hardcoded test data** - all values generated at runtime via factories.

### Important: Barrel File Imports (Use These!)

- **UI tests**: `import { test, expect } from '../../fixtures';`
- **API tests**: `import { apiTest, expect } from '../../fixtures';`
- **Pages**: `import { HomePage, LoginPage, LOCATORS } from '../../pages';`
- **Services**: `import { ProductService, BrandService } from '../../services';`
- **Test Data**: `import { UserDataFactory, AddressBuilder } from '../../common/testData';`
- **Never import from individual files** - always use barrel files (index.ts)

---

## Project-Specific Patterns

### 1. UI Test Pattern (Page Object Model)

```typescript
import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';

test('user registration', async ({ homePage, loginPage }) => {
  // Generate realistic test data - no hardcoded values
  const testUser = UserDataFactory.generateUser();

  await homePage.navigate();
  await homePage.acceptCookiesIfPresent(); // Auto-inherited from BasePage

  // Use page object methods and locators
  await homePage.navigateToSignupLogin();
  await loginPage.fillSignupForm(testUser);
  await expect(loginPage.accountCreatedText).toBeVisible();
});
```

**Key Points:**

- All pages extend `BasePage` (inherits `acceptCookiesIfPresent()`)
- Use `LOCATORS` from barrel import (colocated with pages in `pages/locators.ts`)
- Pages contain components (e.g., `ProductListComponent`) for reusable UI blocks
- Page methods accept domain objects (e.g., `UserRegistrationData`) not inline objects
- Page files use local imports to avoid circular deps: `import { BasePage } from './BasePage'`

### 2. API Test Pattern (Service Factory)

```typescript
import { apiTest, expect } from '../../fixtures';

// Option A: Use individual service fixture
apiTest('get products', async ({ productService }) => {
  const products = await productService.getAllProducts(); // JSON variant
  expect(products).toHaveProperty('responseCode', 200);
});

// Option B: Get raw Response for detailed validation
apiTest('status check', async ({ productService }) => {
  const response = await productService.getAllProductsResponse(); // Raw response
  expect(response.status()).toBe(200);
});

// Option C: Use factory for multiple services
apiTest('multi-service', async ({ serviceFactory }) => {
  const products = serviceFactory.createProductService();
  const brands = serviceFactory.createBrandService();
  const prodResp = await products.getAllProducts();
  expect(prodResp).toHaveProperty('responseCode', 200);
});
```

**Services Dual-Method Pattern:**

- Each service method has two variants:
  - `methodName()` - returns parsed JSON response object
  - `methodNameResponse()` - returns raw Playwright `Response` object
- Examples: `getAllProducts()` / `getAllProductsResponse()`

### 3. Creating New Services

Extend `BaseService`:

```typescript
export class YourService extends BaseService {
  async yourMethod() {
    const url = this.getFullURL('/api/endpoint');
    return this.requestContext.post(url, { data: {...} });
  }

  async yourMethodResponse() {
    const url = this.getFullURL('/api/endpoint');
    return this.requestContext.post(url, { data: {...} });
  }
}
```

Then:

1. Export from `services/index.ts`
2. Add to `ServiceFactory.ts`
3. Add fixture to `apiFixtures.ts`

---

## File Structure & Key Locations

```
auth/
├── auth.setup.ts          # Global setup (handles cookies, saves to playwright/.auth/)
└── .auth/cookies.json     # Cached cookies (gitignored)

common/
├── testData/
│   ├── index.ts                    # 🎯 Barrel file
│   ├── UserDataFactory.ts          # faker.js factory for generating realistic test data
│   └── AddressBuilder.ts           # Fluent builder for Address objects
├── utils/
│   ├── cookieHandler.ts            # Cookie modal handling
│   └── ServiceFactory.ts           # API service factory
└── constants/
    └── index.ts                    # 🎯 Barrel file (API_ENDPOINTS, ERROR_MESSAGES, TIMEOUTS)

services/
├── index.ts                 # 🎯 Barrel file (export all services)
├── BaseService.ts          # Base class (baseURL, requestContext)
├── ProductService.ts
├── BrandService.ts
├── AuthService.ts
└── UserService.ts

pages/
├── index.ts                 # 🎯 Barrel file (export all pages + LOCATORS)
├── locators.ts             # LOCATORS constant (moved here from common/)
├── BasePage.ts             # Inherits CookieHandler
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
│   └── example.api.spec.ts  # API tests (use apiTest from barrel)
├── ui/
│   └── registration.spec.ts # UI tests (use test from barrel)
└── cookieConsent.spec.ts    # UI tests (use test from barrel)
```

---

## Critical Rules

1. **Barrel Files**: Always import from `index.ts` files, never directly from source files
   - ❌ `import { HomePage } from '../../pages/HomePage'`
   - ✅ `import { HomePage } from '../../pages'`

2. **Storage State**: Tests reuse `playwright/.auth/cookies.json` (set in playwright.config.ts)
   - Global setup runs once, saves cookie state
   - All tests inherit authenticated session automatically

3. **Centralized Selectors**: All UI selectors in `pages/locators.ts` (colocated with pages)
   - Define locators as string constants: `ACCOUNT_CREATED_TEXT: 'Account Created!'`
   - Use `page.getByText(LOCATORS.LOGIN_PAGE.ACCOUNT_CREATED_TEXT)` in page objects
   - Never hardcode selectors inline in tests or page objects

4. **Test Data Objects**: Pass entire domain objects (e.g., `UserRegistrationData`) to page methods
   - Page methods extract needed values internally (e.g., `user.address.zipcode`)
   - This eliminates verbose mapping objects in tests

5. **Service Dual Methods**: Every service method has `.Response()` variant
   - Use JSON variant for data assertions
   - Use Response variant for HTTP status checks

6. **Circular Dependency Prevention**: Page files use local imports
   - ✅ Pages: `import { BasePage } from './BasePage'` (local)
   - ✅ External: `import { HomePage } from '../pages'` (barrel)

7. **ESLint Config**: API tests excluded from Playwright linting rules
   - UI tests: Full Playwright plugin rules enforced
   - API tests: No linting checks (custom apiTest differs from standard test)

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
