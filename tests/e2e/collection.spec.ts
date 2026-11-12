import { expect, test, type Page } from '@playwright/test'

async function addVideo(page: Page, title: string, id: string) {
  await page.getByPlaceholder('Paste YouTube URL...').fill(`https://youtu.be/${id}`)
  await page.getByPlaceholder('Custom title (optional)').fill(title)
  await page.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(page.getByText(title, { exact: true })).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.route('https://i.ytimg.com/**', (route) => route.abort())
  await page.goto('./')
  await page.getByRole('button', { name: 'Accept', exact: true }).click()
})

test('creates a page, reorders its videos, and restores them after reload', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'My First Page' })).toBeVisible()
  await page.getByTitle('New page').click()
  await expect(page.getByRole('heading', { name: 'New Page' })).toBeVisible()
  await page.getByTitle('Edit mode').click()

  await addVideo(page, 'First video', 'dQw4w9WgXcQ')
  await addVideo(page, 'Second video', 'M7lc1UVf-VE')

  const cards = page.locator('.video-card')
  await cards.first().getByTitle('Drag to reorder').dragTo(cards.nth(1))
  await expect(page.locator('.video-title')).toHaveText(['Second video', 'First video'])

  await page.getByLabel('Grid', { exact: true }).selectOption('2')
  await page.getByTitle('Hide thumbnails').click()
  await page.getByTitle('Present mode').click()
  await expect(page.getByPlaceholder('Paste YouTube URL...')).toBeHidden()

  await page.reload()
  await page.locator('.page-list').getByText('New Page', { exact: true }).click()
  await expect(page.locator('.video-title')).toHaveText(['Second video', 'First video'])
  await expect(page.locator('.video-card img')).toHaveCount(0)
  await page.getByTitle('Edit mode').click()
  await expect(page.getByLabel('Grid', { exact: true })).toHaveValue('2')
})

test('requires confirmation before replacing the collection from a backup', async ({ page }) => {
  await page.getByTitle('Edit mode').click()
  const backup = {
    name: 'collection.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      pages: [{ id: 'restored', title: 'Restored page', videos: [] }],
    })),
  }
  const input = page.locator('input[type=file]')
  await input.setInputFiles(backup)
  await expect(page.getByRole('heading', { name: 'Import collection?' })).toBeVisible()
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.locator('.page-list')).toContainText('My First Page')

  await input.setInputFiles(backup)
  await page.locator('.modal-actions').getByRole('button', { name: 'Import', exact: true }).click()
  await page.getByTitle('Present mode').click()
  await expect(page.getByRole('heading', { name: 'Restored page' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Restored page' })).toBeVisible()
})
