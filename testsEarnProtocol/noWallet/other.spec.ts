import { test } from '#earnProtocolFixtures';

test.describe('Other tests', async () => {
	test('It should accep cookies banner', async ({ app }) => {
		await app.banners.cookies.shouldBeVisible();

		// Wait to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.banners.cookies.accept();
		await app.banners.cookies.shouldBeNotVisible();
	});

	test('It should reject cookies banner', async ({ app }) => {
		await app.banners.cookies.shouldBeVisible();

		// Wait to avoid random fails
		await app.page.waitForTimeout(2_000);

		await app.banners.cookies.reject();
		await app.banners.cookies.shouldBeNotVisible();
	});
});
