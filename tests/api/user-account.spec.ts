import { test, expect } from '../../fixtures';
import { UserDataFactory } from '../../common/testData';
import { StatusCodes } from 'http-status-codes';
import { API_MESSAGES } from '../../common/constants';
import { UserResponseSchema } from '../../common/schemas';

test.describe('User Account API', () => {
  test.describe('POST Create/Register User Account', () => {
    test('should create user account with valid data', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const response = await userService.createUserAccount(userData);

      expect(response.responseCode).toBe(StatusCodes.CREATED);
      expect(response.message).toBe(API_MESSAGES.USER.CREATE);

      await userService.deleteUserAccount(userData.email, userData.password);
    });

    test('should fail to create user with existing email', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const firstResponse = await userService.createUserAccount(userData);
      expect(firstResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.createUserAccount(userData);

      expect(response.responseCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.message).toBe(API_MESSAGES.USER.ALREADY_EXISTS);

      await userService.deleteUserAccount(userData.email, userData.password);
    });

    test('should fail to create user with invalid email format', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();
      const invalidEmailData = { ...userData, email: 'invalid-email-format' };

      const response = await userService.createUserAccount(invalidEmailData);

      expect(response.responseCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  test.describe('DELETE User Account', () => {
    test('should delete existing user account', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.deleteUserAccount(userData.email, userData.password);

      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.message).toBe(API_MESSAGES.USER.DELETE);
    });

    test('should fail to delete with invalid credentials', async ({ userService }) => {
      const { nonexistentEmail, invalidPassword } = UserDataFactory.generateInvalidCredentials();
      const response = await userService.deleteUserAccount(nonexistentEmail, invalidPassword);

      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.message).toBe(API_MESSAGES.USER.NOT_FOUND);
    });

    test('should fail to delete with missing password', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.deleteUserAccount(userData.email, '');

      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);

      await userService.deleteUserAccount(userData.email, userData.password);
    });

    test('should fail to delete with correct email but wrong password', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.deleteUserAccount(userData.email, 'WrongPassword123!');

      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);

      await userService.deleteUserAccount(userData.email, userData.password);
    });
  });

  test.describe('PUT Update User Account', () => {
    test('should update existing user account', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const updatedData = {
        ...userData,
        firstname: 'UpdatedFirstName',
        lastname: 'UpdatedLastName',
      };
      const response = await userService.updateUserAccount(
        userData.email,
        userData.password,
        updatedData
      );

      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.message).toBe(API_MESSAGES.USER.UPDATE);

      const updatedUser = await userService.getUserAccountByEmail(userData.email);
      expect(updatedUser.responseCode).toBe(StatusCodes.OK);
      expect(updatedUser.user.first_name).toBe(updatedData.firstname);
      expect(updatedUser.user.last_name).toBe(updatedData.lastname);

      await userService.deleteUserAccount(userData.email, userData.password);
    });

    test('should fail to update non-existent account', async ({ userService }) => {
      const { nonexistentEmail, invalidPassword } = UserDataFactory.generateInvalidCredentials();
      const userData = UserDataFactory.generateApiTestUserData();

      const response = await userService.updateUserAccount(
        nonexistentEmail,
        invalidPassword,
        userData
      );

      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.message).toBe(API_MESSAGES.USER.NOT_FOUND);
    });
  });

  test.describe('GET User Account Detail by Email', () => {
    test('should get user details by email with all fields matching creation data', async ({
      userService,
    }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.getUserAccountByEmail(userData.email);

      expect(response.responseCode).toBe(StatusCodes.OK);
      expect(response.user.email).toBe(userData.email);
      expect(response.user.name).toBe(userData.name);
      expect(response.user.title).toBe(userData.title);
      expect(response.user.first_name).toBe(userData.firstname);
      expect(response.user.last_name).toBe(userData.lastname);
      expect(response.user.company).toBe(userData.company);
      expect(response.user.address1).toBe(userData.address1);
      expect(response.user.address2).toBe(userData.address2);
      expect(response.user.country).toBe(userData.country);
      expect(response.user.state).toBe(userData.state);
      expect(response.user.city).toBe(userData.city);
      expect(response.user.zipcode).toBe(userData.zipcode);
      expect(response.user.birth_day).toBe(userData.birth_date);
      expect(response.user.birth_month).toBe(userData.birth_month);
      expect(response.user.birth_year).toBe(userData.birth_year);

      await userService.deleteUserAccount(userData.email, userData.password);
    });

    test('should fail to get details for non-existent email', async ({ userService }) => {
      const { nonexistentEmail } = UserDataFactory.generateInvalidCredentials();
      const response = await userService.getUserAccountByEmail(nonexistentEmail);

      expect(response.responseCode).toBe(StatusCodes.NOT_FOUND);
      expect(response.message).toBe(API_MESSAGES.USER.NOT_FOUND_BY_EMAIL);
    });
  });

  test.describe('GET User Account - Schema Validation', () => {
    test('should return valid user response schema', async ({ userService }) => {
      const userData = UserDataFactory.generateApiTestUserData();

      const createResponse = await userService.createUserAccount(userData);
      expect(createResponse.responseCode).toBe(StatusCodes.CREATED);

      const response = await userService.getUserAccountByEmail(userData.email);

      const result = UserResponseSchema.safeParse(response);
      expect(result.success).toBe(true);

      await userService.deleteUserAccount(userData.email, userData.password);
    });
  });
});
