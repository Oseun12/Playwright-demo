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
    await page.waitForSelector('button.add', { timeout: 10000 })
    await page.click('button.add');
});

test('Remove from Cart', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng/cart/');

    if (await page.locator('button.remove').count() > 0) {
        await page.locator('button.remove').first().click();
        await expect(page.locator('text=Your cart is empty')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Start Shopping')).toBeVisible();
    } else {
        await expect(page.locator('text=Your cart is empty')).toBeVisible();
        await expect(page.locator('text=Start Shopping')).toBeVisible();
        console.log('Cart was already empty');
    }
});

test('To check for empty state', async ({ page }) => {
    await page.goto('https://www.jumia.com.ng/cart/');
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('text=Start Shopping')).toBeVisible();
});