import { test } from '#earnProtocolFixtures';

test.describe('Header', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		// Wait to avoid random fails
		await app.header.shouldHaveSummerfiLogo();
		await app.page.waitForTimeout(2_000);
	});

	test('It should open Landing page', async ({ app }) => {
		await app.header.summerfi();
		await app.landingPage.shouldBeVisible();
	});

	test('It should open Earn page', async ({ app }) => {
		await app.header.earn();

		await app.earn.shouldBeVisible();
	});

	// TODO - With email login
	test.skip('It should open Portfolio page', async ({ app }) => {
		// TODO - With email login
	});

	test('It should open $SUMR page', async ({ app }) => {
		await app.header.sumr();

		await app.sumr.shouldBeVisible();
	});

	test('It should open "Explore" pages', async ({ app }) => {
		await app.header.explore.open();
		await app.header.explore.select('User Activity');
		await app.page.mouse.move(200, 0);
		await app.userActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Rebalancing Activity');
		await app.page.mouse.move(200, 0);
		await app.rebalancingActivity.shouldBeVisible();
	});

	test('It should open "Support" pages', async ({ app }) => {
		await app.header.support.open();

		await app.header.support.shouldHave(['Contact us', 'Sign up', 'Start chatting']);
	});
});
