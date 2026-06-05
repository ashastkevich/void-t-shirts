import { test, expect } from '@playwright/test'

test.describe('Admin panel — access control', () => {
  test('redirects unauthenticated user from /admin to /', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL('/', { timeout: 5000 })
  })

  test('redirects unauthenticated user from /admin/products/new to /', async ({ page }) => {
    await page.goto('/admin/products/new')
    await expect(page).toHaveURL('/', { timeout: 5000 })
  })
})

// These tests require admin credentials and are skipped in CI without them.
// Run locally with ADMIN_EMAIL and ADMIN_PASSWORD env vars set.
test.describe('Admin panel — authenticated', () => {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  test.skip(!adminEmail || !adminPassword, 'Requires ADMIN_EMAIL and ADMIN_PASSWORD env vars')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('ВОЙТИ').click()
    await page.getByPlaceholder('your@email.com').fill(adminEmail!)
    await page.getByPlaceholder('••••••••').fill(adminPassword!)
    await page.getByRole('button', { name: 'ВОЙТИ' }).click()
    await page.waitForURL('/', { timeout: 5000 })
    await page.goto('/admin')
    await expect(page).toHaveURL('/admin', { timeout: 5000 })
  })

  test('admin sees product list', async ({ page }) => {
    await expect(page.getByText('VOID ADMIN')).toBeVisible()
  })

  test('admin can navigate to add product page', async ({ page }) => {
    await page.getByText('Добавить').click()
    await expect(page).toHaveURL('/admin/products/new')
    await expect(page.getByRole('button', { name: 'Создать товар' })).toBeVisible()
  })

  test('product form has all required fields', async ({ page }) => {
    await page.goto('/admin/products/new')
    await expect(page.getByPlaceholder('ULTRA BLACK')).toBeVisible()
    await expect(page.getByPlaceholder('ultra-black')).toBeVisible()
    await expect(page.getByPlaceholder('12900')).toBeVisible()
    await expect(page.getByPlaceholder('100% органический хлопок • 220 г/м²')).toBeVisible()
  })

  test('delete button shows confirmation before deleting', async ({ page }) => {
    // Wait for product list to load
    const deleteBtn = page.getByTitle('Удалить').first()
    if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteBtn.click()
      await expect(page.getByText('Да')).toBeVisible()
      await expect(page.getByText('Нет')).toBeVisible()
      // Cancel
      await page.getByText('Нет').click()
      await expect(page.getByTitle('Удалить').first()).toBeVisible()
    }
  })
})
