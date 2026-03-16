export const ERROR_MESSAGES = {
  PRODUCT: {
    GET_ALL_FAILED: 'Failed to get all products',
    POST_FAILED: 'Failed to post to products list',
    SEARCH_FAILED: 'Failed to search products',
  },
  BRAND: {
    GET_ALL_FAILED: 'Failed to get all brands',
    PUT_FAILED: 'Failed to put to brands list',
  },
  AUTH: {
    VERIFY_LOGIN_FAILED: 'Failed to verify login',
  },
  USER: {
    CREATE_FAILED: 'Failed to create user account',
    DELETE_FAILED: 'Failed to delete user account',
    UPDATE_FAILED: 'Failed to update user account',
    GET_DETAIL_FAILED: 'Failed to get user account details',
  },
  COOKIE: {
    ACCEPT_FAILED: 'Failed to accept cookie consent',
  },
} as const;
