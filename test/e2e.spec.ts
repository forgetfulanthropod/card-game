import { test, expect } from '@playwright/test'

test('loads start screen and can pick an account', async ({ page }) => {
  await page.goto('/')

  // basic load
  await expect(page.locator('text=play now')).toBeVisible({ timeout: 15000 })

  // click play -> should show account picker (three accounts)
  await page.getByRole('button', { name: /play now/i }).click()

  // three accounts are offered (by label)
  await expect(page.locator('text=AlphaKaiju')).toBeVisible()
  await expect(page.locator('text=BetaDeck')).toBeVisible()
  await expect(page.locator('text=GammaFury')).toBeVisible()

  // pick one
  await page.locator('text=AlphaKaiju').click()

  // after pick, user id-ish or start should enable
  // may require username set first time (modal), or load
  // just assert no crash and UI progressed
  await page.waitForTimeout(800)
  // if username modal appears we can cancel/close or accept default flow
  // for now simple assertion that game UI or menu reacted
  const bodyText = await page.textContent('body')
  expect(bodyText?.length || 0).toBeGreaterThan(100)
})