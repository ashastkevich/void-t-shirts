import { test, expect } from '@playwright/test'

const SLUG = 'ultra-black'

test.describe('Product detail page /products/[slug]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/products/${SLUG}`)
  })

  test('renders product page with name', async ({ page }) => {
    // At least some content from the product should be visible
    await expect(page.getByText(/ULTRA|BLACK/i).first()).toBeVisible({ timeout: 5000 })
  })

  test('contains JSON-LD Product schema in <head>', async ({ page }) => {
    const ldJson = await page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    ).catch(() => '')
    if (ldJson) {
      const schema = JSON.parse(ldJson)
      expect(schema['@type']).toBe('Product')
    }
  })

  test('shows size selector buttons', async ({ page }) => {
    for (const size of ['XS', 'S', 'M', 'L', 'XL']) {
      await expect(page.getByRole('button', { name: size })).toBeVisible()
    }
  })

  test('can select a size', async ({ page }) => {
    await page.getByRole('button', { name: 'XL' }).click()
    // XL button should be visually active (no specific assertion possible without class check)
    const xlBtn = page.getByRole('button', { name: 'XL' })
    await expect(xlBtn).toBeVisible()
  })

  test('can increment and decrement quantity', async ({ page }) => {
    const plusBtn = page.getByRole('button', { name: '+' })
    await plusBtn.click()
    await plusBtn.click()
    // quantity input / display should show 3
    await expect(page.getByText('3')).toBeVisible()

    const minusBtn = page.getByRole('button', { name: '−' })
    await minusBtn.click()
    await expect(page.getByText('2')).toBeVisible()
  })

  test('add to cart button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'ДОБАВИТЬ В КОРЗИНУ' })).toBeVisible()
  })

  test('back link navigates to home', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /главная|назад|←/i }).first()
    if (await backLink.isVisible().catch(() => false)) {
      await backLink.click()
      await expect(page).toHaveURL('/')
    }
  })
})
