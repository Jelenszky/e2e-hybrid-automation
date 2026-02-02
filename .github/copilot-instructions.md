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
- **Factory**: `ServiceFactory` in `services/utils/` creates typed service instances
- **Fixtures**: `apiFixtures.ts` provides individual services and factory
- **Test Files**: `tests/api/user-account.spec.ts` (17+ tests with AAA pattern)
- **HTTP Transport**: Form-encoded (`application/x-www-form-urlencoded`) configured globally in `playwright.config.ts` via `extraHTTPHeaders`
- **Type Safety**: Centralized response schemas in `services/types/index.ts` + Zod validation in `common/schemas/`
- **Cookie Handling**: Global setup `cookies/cookies.setup.ts` saves authenticated state to `cookies/.cookies/cookies.json` (gitignored)

### Why This Hybrid Structure

- **Separation of Concerns**: UI tests use Playwright directly; API tests use REST services
- **Code Reuse**: Factory pattern ensures consistent API initialization
- **Scalability**: Services extend BaseService for shared functionality
- **Type Safety**: Full TypeScript with semantic response types (no `any` types)
- **Test Isolation**: Each test creates/deletes own data; excellent isolation without worker-scoped fixtures
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
npx eslint . --fix                                      # Auto-fix linting issues
npx prettier --write .                                  # Format code
```

### Test Data Generation

Tests use **faker.js** for all data - **zero hardcoded values**:

- `UserDataFactory.generateUser()` - Complete user with faker-generated name, email, address
- `UserDataFactory.generateApiTestUserData()` - Returns single API-formatted object with all fields
- `UserDataFactory.generateInvalidCredentials()` - Returns `{ nonexistentEmail, invalidPassword }` for error scenarios
- `AddressBuilder` - Fluent builder for Address objects with sensible faker defaults
- **Key**: Address2 is auto-generated to match API response (never undefined)

### Important: Barrel File Imports (Use These!)

- **UI tests**: `import { test, expect } from '../../fixtures';`
- **API tests**: `import { apiTest, expect } from '../../fixtures';`
- **Pages**: `import { HomePage, LoginPage, LOCATORS } from '../../pages';`
- **Services & Types**: `import { UserService, UserResponseSchema } from '../../services';`
- **Test Data**: `import { UserDataFactory, AddressBuilder } from '../../common/testData';`
- **Schemas**: `import { UserResponseSchema } from '../../common/schemas';`
- **Never import from individual files** - always use barrel files (index.ts)

---

## Project-Specific Patterns

### 1. API Test Pattern (AAA: Arrange-Act-Assert)

```typescript
import { apiTest, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';
import { StatusCodes } from 'http-status-codes';
import { API_MESSAGES } from '../../common/constants';

apiTest('should create user account with valid data', async ({ userService }) => {
  // ARRANGE
  const userData = UserDataFactory.generateApiTestUserData();

  // ACT
  const response = await userService.createUserAccount(userData);

  // ASSERT
  expect(response.responseCode).toBe(StatusCodes.CREATED);
  expect(response.message).toBe(API_MESSAGES.USER.CREATE);

  // CLEANUP
  await userService.deleteUserAccount(userData.email, userData.password);
});
```

**Key Patterns**:

- Services return parsed JSON body directly (not Response objects)
- All assertions use `expect()` (from apiTest fixture)
- Tests always clean up created resources (delete after create)
- Test names describe the scenario, not the assertion

### 2. Service Pattern with Type Safety

```typescript
// UserService extends BaseService - returns typed UserResponse
async getUserAccountByEmail(email: string): Promise<UserResponse> {
  const response = await this.request.get(`${this.baseURL}/api/user?email=${email}`);
  return response.json();
}

// Response type enforces shape and provides IDE autocomplete
const response = await userService.getUserAccountByEmail('test@example.com');
expect(response.user.email).toBe('test@example.com'); // ✅ IDE knows response.user exists
```

### 3. Schema Validation with Zod

```typescript
import { UserResponseSchema } from '../../common/schemas';

apiTest('should return valid user response schema', async ({ userService }) => {
  const userData = UserDataFactory.generateApiTestUserData();
  const createResponse = await userService.createUserAccount(userData);
  const response = await userService.getUserAccountByEmail(userData.email);

  // Validate response shape
  const result = UserResponseSchema.safeParse(response);
  expect(result.success).toBe(true);

  await userService.deleteUserAccount(userData.email, userData.password);
});
```

### 4. API Response Field Mapping

The API transforms request field names in responses:

- Request: `firstname` → Response: `first_name`
- Request: `lastname` → Response: `last_name`
- Request: `birth_date` → Response: `birth_day`
- Tests verify these mappings with conditional checks or schema validation

---

## File Structure & Key Locations

```
cookies/
├── cookies.setup.ts          # Global setup (handles cookies, runs once before all tests)
└── .cookies/cookies.json     # Cached cookies (gitignored, auto-created)

common/
├── schemas/
│   ├── index.ts              # 🎯 Barrel for Zod schemas
│   └── userSchemas.ts        # UserSchema, UserResponseSchema
├── testData/
│   ├── index.ts              # 🎯 Barrel file
│   ├── UserDataFactory.ts    # generateUser(), generateApiTestUserData(), generateInvalidCredentials()
│   └── AddressBuilder.ts     # Fluent builder with faker defaults
├── constants/
│   └── index.ts              # API_ENDPOINTS, API_MESSAGES (responses)
└── utils/
    └── cookieHandler.ts      # Cookie modal handling

services/
├── index.ts                  # 🎯 Barrel (exports services, types, factory)
├── types/
│   └── index.ts              # Response interfaces (UserResponse, ProductResponse, etc.)
├── utils/
│   └── ServiceFactory.ts     # Creates typed service instances
├── BaseService.ts            # buildFormData(), request context
├── UserService.ts            # CRUD + typed responses
├── ProductService.ts
├── BrandService.ts
└── AuthService.ts

pages/
├── index.ts                  # 🎯 Barrel file
├── locators.ts               # All UI selectors as constants
├── BasePage.ts               # acceptCookiesIfPresent(), navigate()
├── HomePage.ts, LoginPage.ts, etc.
└── components/
    ├── index.ts              # 🎯 Barrel file
    ├── ProductListComponent.ts
    └── OrderConfirmationModalComponent.ts

fixtures/
├── index.ts                  # 🎯 Barrel (exports test, apiTest, expect)
├── pageFixtures.ts           # UI test fixtures (page objects)
└── apiFixtures.ts            # API test fixtures (services)

tests/
├── api/
│   └── user-account.spec.ts  # 17+ tests: CRUD, edge cases, schema validation
├── ui/
│   └── registration.spec.ts
├── hybrid/
│   └── registration.spec.ts
└── cookieConsent.spec.ts
```

---

## Critical Rules

1. **Barrel Files**: Always import from index.ts, never individual files
   - ❌ `import { HomePage } from '../../pages/HomePage'`
   - ✅ `import { HomePage } from '../../pages'`

2. **Test Data**: Use `UserDataFactory` - no hardcoded values
   - ✅ `const userData = UserDataFactory.generateApiTestUserData();`
   - ✅ `const { nonexistentEmail } = UserDataFactory.generateInvalidCredentials();`

3. **Service Type Safety**: All service methods return semantic types
   - ✅ `Promise<UserResponse>`, `Promise<ProductResponse>`
   - ❌ `Promise<any>`
   - Services call `.json()` internally; tests use parsed body directly

4. **Form-Encoded Requests**: Always use `buildFormData()` for POST/PUT/DELETE
   - Global `extraHTTPHeaders` provides `Content-Type` header automatically
   - Helper skips `undefined` values; generates address2 always

5. **Selectors**: All UI selectors in `pages/locators.ts` as constants
   - Never hardcode selectors in page objects or tests
   - Reference via: `LOCATORS.PAGE_NAME.SELECTOR_NAME`

6. **API Constants**: Defined in `common/constants/index.ts`
   - `API_ENDPOINTS` for routes
   - `API_MESSAGES` for response validation

7. **Schema Validation**: Use Zod for response shape verification
   - Import schemas from `common/schemas`
   - Use `.safeParse()` to validate before assertions

---

## Common Pitfalls & Solutions

| Issue                                 | Solution                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Type errors on response properties    | Import response type from services barrel: `import { UserResponse } from '../../services'`  |
| Undefined field in response assertion | Check AddressBuilder generates all fields; API may return empty string `""` not `undefined` |
| Service not found error               | Use barrel imports: `import { UserService } from '../../services'` not individual files     |
| Circular dependencies in pages        | Pages: local imports (`./BasePage`), Tests: barrel imports (`'../../pages'`)                |
| ESLint errors on new files            | Add path to `tsconfig.json` include array; add folder to `.gitignore` if needed             |

---

## Test Status & Commands

```bash
npx playwright test                      # Run all tests (currently passing)
npx playwright test --reporter=line      # Simple output
npx playwright show-report               # HTML report viewer
npx eslint . --fix                      # Auto-fix linting
npx prettier --write .                   # Format all files
git add . && git commit -m "message"     # Commit changes
```
