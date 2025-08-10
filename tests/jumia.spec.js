import { test, expect } from '@playwright/test';

test('Searching for a product', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng');

    await page.fill('input[type="text"]', "Laptop");
    await page.keyboard.press('Enter');
    await expect(page.locator('article a.core').first()).toBeVisible();
});

test('Viewing a product', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng/catalog/?q=Laptop');
    await page.locator('article a.core').first().click();
    await expect(page.locator('button.add').first()).toBeVisible();
});

test('Add to cart', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng/catalog/?q=Laptop');
    await page.locator('article a.core').first().click();
    await page.waitForSelector('button.add', { timeout: 10000 });
    const [response] = await Promise.all([
        page.waitForResponse(/\/cart/),
        page.click('button.add')
    ]);
    expect (response.status()).toBe(200);
});

test('Remove from Cart', async ({ page }) => {
    test.slow(); 

    await page.goto('https://www.jumia.com.ng/cart/');

    const removeButton = page.getByRole('button', { name: 'remove' });
    const emptyText = page.getByText('Your cart is empty');

    if (await removeButton.count() > 0) {
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/cart') && resp.status() === 200),
        removeButton.first().click()
      ]);
      expect(response.ok()).toBeTruthy();

      await expect(emptyText).toBeVisible();
      await expect(page.getByText('Start Shopping')).toBeVisible();
    } else {
      await expect(emptyText).toBeVisible();
      await expect(page.getByText('Start Shopping')).toBeVisible();
      console.log('Cart was already empty before test.');
    }
});

test('To check for empty state', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng/cart/');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('text=Start Shopping')).toBeVisible();
});


