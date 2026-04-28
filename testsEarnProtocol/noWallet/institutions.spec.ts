import { test } from '#earnProtocolFixtures';

// SKIP - Update or remove test once new landing pages are completed
test.describe.skip('Institution pages @regression', async () => {
	test.beforeEach(async ({ app }) => {
		await app.institutions.openPage();
	});

	test('It should open "Self managed Vaults" pages', async ({ app }) => {
		await app.institutions.open('Self managed Vaults');
		await app.institutions.selfManagedVaults.shouldBeVisible();
	});

	test('It should open "Public Access" pages', async ({ app }) => {
		await app.institutions.open('Public Access Vaults');
		await app.institutions.publicAccessVaults.shouldBeVisible();
	});
});
