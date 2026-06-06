import {expect, test} from './coverage';

test('Die Seite öffnet sich und zeigt den Titel an', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Autobahn Safety Monitor/);
});

test('Die Hauptüberschrift ist auf der Seite sichtbar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Autobahn Safety Monitor' })).toBeVisible();
});
