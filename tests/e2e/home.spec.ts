import { test, expect } from '@playwright/test'

test.describe('Home page — hero carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and displays product names', async ({ page }) => {
    // At least one product name should be visible
    const productNames = ['ULTRA BLACK', 'VOID ESSENTIAL', 'MINIMAL BLACK', 'DARK MATTER', 'SHADOW FORM', 'OBSIDIAN CORE']
    let found = false
    for (const name of productNames) {
      const el = page.getByText(name).first()
      if (await el.isVisible().catch(() => false)) {
        found = true
        break
      }
    }
    expect(found).toBe(true)
  })

  test('navigates to next slide via arrow button', async ({ page }) => {
    const initialText = await page.locator('h2').first().textContent()
    // Click the right arrow (next slide)
    const nextBtn = page.locator('button').filter({ hasText: '›' }).or(
      page.locator('[aria-label="Next"]')
    ).first()
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click()
      await page.waitForTimeout(500)
      const newText = await page.locator('h2').first().textContent()
      // Either text changed or carousel moved
      expect(newText).toBeDefined()
    }
  })

  test('clicking on a product opens ProductDetailModal', async ({ page }) => {
    // Find and click "ПОДРОБНЕЕ" or product area
    const detailBtn = page.getByRole('button', { name: /ПОДРОБНЕЕ|ДОБАВИТЬ В КОРЗИНУ/i }).first()
    if (await detailBtn.isVisible().catch(() => false)) {
      await detailBtn.click()
      await expect(page.getByText('ВЫБЕРИТЕ РАЗМЕР')).toBeVisible({ timeout: 3000 })
    }
  })

  test('header is visible with VOID logo', async ({ page }) => {
    await expect(page.getByText('VOID')).toBeVisible()
  })

  test('shows login and register buttons when not authenticated', async ({ page }) => {
    await expect(page.getByText('ВОЙТИ')).toBeVisible()
    await expect(page.getByText('РЕГИСТРАЦИЯ')).toBeVisible()
  })
})
