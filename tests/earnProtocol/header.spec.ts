import { test } from '#earnProtocolFixtures';

test.describe('Header', async () => {
	test('It should open Earn page', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.earn();

		await app.earn.shouldBeVisible();
	});

	test('It should show "Explore" options', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.explore.open();
		await app.header.explore.shouldList(['User activity', 'Rebalancing Activity', 'Yield Trend']);
	});
});
