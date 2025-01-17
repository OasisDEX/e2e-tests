import { test } from '#earnProtocolFixtures';

test.describe('Header', async () => {
	test('It should open Landing page', async ({ app }) => {
		// Wait to avoid random fails
		await app.header.shouldHaveSummerfiLogo();
		await app.page.waitForTimeout(1_000);

		await app.header.summerfi();
		await app.landingPage.shouldBeVisible();
	});

	test('It should open Earn page', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.earn();

		await app.earn.shouldBeVisible();
	});

	test.skip('It should open Portfolio page', async ({ app }) => {
		// in `withEmailLogin.spec.ts` file, since `Portfolio` is only displayed when logged in
	});

	test('It should open $SUMR page', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.sumr();

		await app.sumr.shouldBeVisible();
	});

	test('It should open "Explore" pages', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.explore.open();
		await app.header.explore.select('User Activity');
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

	test.only('It should open "Support" pages', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.support.open();

		//
		await app.pause();
		//

		// ============
		await app.header.explore.select('User Activity');
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
