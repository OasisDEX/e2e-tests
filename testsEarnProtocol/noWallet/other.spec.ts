import { test } from '#earnProtocolFixtures';

test.describe('Other tests', async () => {
	test.beforeEach(async ({ context, app }) => {
		await context.clearCookies();
		await app.page.reload();

		await app.banners.cookies.shouldBeVisible();
		await app.waitForAppToBeStable();
	});

	test('It should accept cookies banner', async ({ app }) => {
		await app.banners.cookies.accept();
		await app.banners.cookies.shouldBeNotVisible();
	});

	test('It should reject cookies banner', async ({ app }) => {
		await app.banners.cookies.reject();
		await app.banners.cookies.shouldBeNotVisible();
	});
});
