import { test } from '#earnProtocolFixtures';
import { expect } from '#noWalletFixtures';

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

	test('It should open "Support" pages', async ({ app }) => {
		await app.header.shouldHaveSummerfiLogo();

		await app.header.support.open();

		// TODO - Failing bug on purpose
		expect(false, 'Failing bug on purpose - TODO').toBeTruthy();
		//
		await app.header.support.select('Contact us');
		await app.page.mouse.move(200, 0);
		// TODO - Assert action result

		await app.header.support.open();
		await app.header.support.select('Sign up');
		await app.page.mouse.move(200, 0);
		// TODO - Assert action result
		// await app.page.mouse.move(200, 0);

		await app.header.support.open();
		await app.header.support.select('Start chatting');
		await app.page.mouse.move(200, 0);
		// TODO - Assert action result
	});
});
