import { test } from '#earnProtocolFixtures';

test.describe('Header', async () => {
	test('It should open Earn page', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.earn();

		await app.earn.shouldBeVisible();
	});

	test('It should open "Explore" pages', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.explore.open();
		await app.header.explore.select('User activity');
		await app.page.mouse.move(200, 0);
		await app.userActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Rebalancing Activity');
		await app.page.mouse.move(200, 0);
		await app.rebalancingActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Yield Trend');
		await app.page.mouse.move(200, 0);
		await app.yieldTrend.shouldBeVisible();
	});
});
