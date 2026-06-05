import { test, expect } from '@playwright/test'

test.describe('Authentication flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Login modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('ВОЙТИ').click()
      await expect(page.getByText('LOGIN')).toBeVisible()
    })

    test('opens login modal when ВОЙТИ is clicked', async ({ page }) => {
      await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
      await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    })

    test('shows error for invalid credentials', async ({ page }) => {
      await page.getByPlaceholder('your@email.com').fill('wrong@test.com')
      await page.getByPlaceholder('••••••••').fill('wrongpassword')
      await page.getByRole('button', { name: 'ВОЙТИ' }).click()
      // Should show error message
      await expect(page.locator('.text-red-400')).toBeVisible({ timeout: 5000 })
    })

    test('switches to forgot password mode', async ({ page }) => {
      await page.getByText('Забыли пароль?').click()
      await expect(page.getByRole('button', { name: 'ВОССТАНОВИТЬ ПАРОЛЬ' })).toBeVisible()
    })

    test('closes modal when × is clicked', async ({ page }) => {
      await page.locator('button').filter({ hasText: '×' }).first().click()
      await expect(page.getByText('LOGIN')).not.toBeVisible()
    })

    test('switches to register modal', async ({ page }) => {
      await page.getByText('Зарегистрироваться').click()
      await expect(page.getByText('REGISTER')).toBeVisible()
    })
  })

  test.describe('Register modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('РЕГИСТРАЦИЯ').click()
      await expect(page.getByText('REGISTER')).toBeVisible()
    })

    test('opens register modal', async ({ page }) => {
      await expect(page.getByPlaceholder('Ваше имя')).toBeVisible()
    })

    test('shows error when passwords do not match', async ({ page }) => {
      await page.getByPlaceholder('Ваше имя').fill('Тест')
      await page.getByPlaceholder('your@email.com').fill('test@test.com')
      const passwordFields = page.getByPlaceholder('••••••••')
      await passwordFields.first().fill('password123')
      await passwordFields.last().fill('different456')
      await page.locator('input[type="checkbox"]').click()
      await page.getByRole('button', { name: 'ЗАРЕГИСТРИРОВАТЬСЯ' }).click()
      await expect(page.getByText('Пароли не совпадают')).toBeVisible()
    })
  })
})
