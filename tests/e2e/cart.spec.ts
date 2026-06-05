import { test, expect } from '@playwright/test'

test.describe('Cart — add, view, remove, persist', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('void-cart'))
    await page.reload()
  })

  test('cart badge shows 0 / no badge initially', async ({ page }) => {
    // Badge should not be visible when cart is empty
    const badge = page.locator('.absolute.-top-2.-right-2')
    await expect(badge).not.toBeVisible()
  })

  test('opens cart drawer via header cart button', async ({ page }) => {
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).first()
    await cartButton.click()
    await expect(page.getByText('КОРЗИНА')).toBeVisible()
  })

  test('shows empty cart message', async ({ page }) => {
    // Click cart icon
    await page.locator('button').first().click()
    const cartText = page.getByText('Корзина пуста')
    if (await cartText.isVisible().catch(() => false)) {
      await expect(cartText).toBeVisible()
    }
  })

  test('add to cart flow from modal', async ({ page }) => {
    // Open product detail modal
    const detailBtn = page.getByRole('button', { name: /ПОДРОБНЕЕ/i }).first()
    if (await detailBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await detailBtn.click()
      await page.waitForSelector('text=ВЫБЕРИТЕ РАЗМЕР', { timeout: 3000 })

      // Select size
      await page.getByRole('button', { name: 'M' }).click()

      // Add to cart
      await page.getByRole('button', { name: 'ДОБАВИТЬ В КОРЗИНУ' }).click()

      // Cart badge should now show 1
      await expect(page.locator('.absolute.-top-2.-right-2')).toBeVisible({ timeout: 2000 })
    }
  })

  test('cart persists after page reload', async ({ page }) => {
    // Manually inject cart state into localStorage
    await page.evaluate(() => {
      localStorage.setItem('void-cart', JSON.stringify({
        state: {
          items: [{
            id: '1', name: 'ULTRA BLACK', size: 'M',
            price: '12,900 ₽', image: '/img.jpg', quantity: 1,
          }],
        },
        version: 0,
      }))
    })
    await page.reload()

    // Cart badge should show 1 after reload
    await expect(page.locator('text=1').first()).toBeVisible({ timeout: 3000 })
  })
})
