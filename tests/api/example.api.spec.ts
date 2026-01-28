import { apiTest, expect } from '../../fixtures';

apiTest.describe('API Services - Example Tests', () => {
  apiTest('Example 1: Get All Products - JSON Response', async ({ productService }) => {
    const products = await productService.getAllProducts();

    expect(products).toHaveProperty('responseCode', 200);
    expect(products).toHaveProperty('products');
  });

  apiTest(
    'Example 2: Get All Products - Raw Response (Status Validation)',
    async ({ productService }) => {
      const response = await productService.getAllProductsResponse();

      expect(response.status()).toBe(200);
      expect(response.ok()).toBe(true);
    }
  );

  apiTest('Example 3: Get All Brands - JSON Response', async ({ brandService }) => {
    const brands = await brandService.getAllBrands();

    expect(brands).toHaveProperty('responseCode', 200);
  });

  apiTest(
    'Example 4: Get All Brands - Raw Response (Status Validation)',
    async ({ brandService }) => {
      const response = await brandService.getAllBrandsResponse();

      expect(response.status()).toBe(200);
      expect(response.ok()).toBe(true);
    }
  );

  apiTest('Example 5: Search Product - JSON Response', async ({ productService }) => {
    const searchResult = await productService.searchProduct('Blue Top');

    expect(searchResult).toHaveProperty('responseCode');
  });

  apiTest(
    'Example 6: Search Product - Raw Response (Status Validation)',
    async ({ productService }) => {
      const response = await productService.searchProductResponse('Blue Top');

      expect(response.status()).toBe(200);
    }
  );

  apiTest('Example 7: Verify Login with Valid Details - JSON Response', async ({ authService }) => {
    const result = await authService.verifyLoginWithValidDetails('test@example.com', 'password123');

    expect(result).toHaveProperty('responseCode');
  });

  apiTest(
    'Example 8: Verify Login with Valid Details - Raw Response (Status Validation)',
    async ({ authService }) => {
      const response = await authService.verifyLoginWithValidDetailsResponse(
        'test@example.com',
        'password123'
      );

      expect(response.status()).toBe(200);
    }
  );

  apiTest(
    'Example 9: Search Product without Parameter - JSON Response',
    async ({ productService }) => {
      const result = await productService.searchProductWithoutParameter();

      expect(result).toHaveProperty('responseCode');
    }
  );

  apiTest('Example 11: Using Service Factory - JSON Responses', async ({ serviceFactory }) => {
    const productSvc = serviceFactory.createProductService();
    const brandSvc = serviceFactory.createBrandService();

    const products = await productSvc.getAllProducts();
    const brands = await brandSvc.getAllBrands();

    expect(products).toHaveProperty('responseCode', 200);
    expect(brands).toHaveProperty('responseCode', 200);
  });

  apiTest('Example 12: Using Service Factory - Raw Responses', async ({ serviceFactory }) => {
    const productSvc = serviceFactory.createProductService();
    const brandSvc = serviceFactory.createBrandService();

    const productsResponse = await productSvc.getAllProductsResponse();
    const brandsResponse = await brandSvc.getAllBrandsResponse();

    expect(productsResponse.status()).toBe(200);
    expect(brandsResponse.status()).toBe(200);
  });
});
