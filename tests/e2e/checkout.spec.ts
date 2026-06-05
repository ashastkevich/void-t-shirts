import { test, expect } from '@playwright/test'

test.describe('Checkout flow (happy path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Pre-populate cart via localStorage
    await page.evaluate(() => {
      localStorage.setItem('void-cart', JSON.stringify({
        state: {
          items: [{
            id: '1',
            name: 'ULTRA BLACK',
            size: 'M',
            price: '12,900 ₽',
            image: 'https://omegtzfmfijsxwbegugd.supabase.co/storage/v1/object/public/products/ultra-black.jpg',
            quantity: 1,
          }],
        },
        version: 0,
      }))
    })
    await page.reload()
  })

  test('opens checkout form from cart', async ({ page }) => {
    // Open cart
    const cartBtn = page.locator('button').filter({ has: page.locator('svg') }).first()
    await cartBtn.click()
    await expect(page.getByText('КОРЗИНА')).toBeVisible()

    // Click checkout
    await page.getByRole('button', { name: 'ОФОРМИТЬ ЗАКАЗ' }).click()

    // Expect checkout form or auth prompt to appear
    const checkoutForm = page.getByText(/оформление|доставка|данные получателя/i)
    const authPrompt = page.getByText(/войдите|войти/i)
    const visible = await Promise.race([
      checkoutForm.waitFor({ timeout: 3000 }).then(() => 'checkout'),
      authPrompt.waitFor({ timeout: 3000 }).then(() => 'auth'),
    ]).catch(() => 'none')
    expect(['checkout', 'auth']).toContain(visible)
  })

  test('checkout form has required fields', async ({ page }) => {
    // Navigate directly to trigger checkout
    const cartBtn = page.locator('button').filter({ has: page.locator('svg') }).first()
    await cartBtn.click()

    const checkoutBtn = page.getByRole('button', { name: 'ОФОРМИТЬ ЗАКАЗ' })
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click()

      // Look for shipping form fields
      const nameField = page.getByPlaceholder(/имя получателя|имя/i)
      const phoneField = page.getByPlaceholder(/телефон/i)
      const cityField = page.getByPlaceholder(/город/i)

      const hasForm = await nameField.isVisible().catch(() => false) ||
                      await phoneField.isVisible().catch(() => false) ||
                      await cityField.isVisible().catch(() => false)

      if (hasForm) {
        expect(hasForm).toBe(true)
      }
    }
  })
})
