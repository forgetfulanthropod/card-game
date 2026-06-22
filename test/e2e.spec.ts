import { test, expect } from '@playwright/test'

test('loads start screen and can pick an account', async ({ page }) => {
  await page.goto('/')

  // New start screen: daily / completionist modes, auto-created username
  await expect(page.getByRole('button', { name: /^daily$/i })).toBeVisible({ timeout: 15000 })
  await expect(page.getByRole('button', { name: /^completionist$/i })).toBeVisible()

  // Account is created automatically on load (player-xxxx username)
  await expect(page.locator('button.font-mono')).toBeVisible({ timeout: 15000 })
  const username = await page.locator('button.font-mono').textContent()
  expect(username?.trim().length || 0).toBeGreaterThan(0)
  expect(username).not.toBe('...')

  // Click completionist — should start a run without crashing
  await page.getByRole('button', { name: /^completionist$/i }).click()

  await page.waitForTimeout(2000)
  const bodyText = await page.textContent('body')
  expect(bodyText?.length || 0).toBeGreaterThan(100)
})
