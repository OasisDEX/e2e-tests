import { test } from '#earnProtocolFixtures';

test.describe('Header @regression', async () => {
	test('It should open Landing page', async ({ app }) => {
		await app.header.summerfi();
		await app.landingPage.shouldBeVisible();
	});

	test('It should open Earn page', async ({ app }) => {
		await app.header.earn();
		await app.earn.shouldBeVisible();
	});

	test('It should open "Explore" pages', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(1_000);

		await app.header.explore.open();
		await app.header.explore.select('$SUMR token');
		await app.page.mouse.move(200, 0);
		await app.sumr.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('User Activity');
		await app.page.mouse.move(200, 0);
		await app.userActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Rebalancing Activity');
		await app.page.mouse.move(200, 0);
		await app.rebalancingActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Institutions');
		await app.page.mouse.move(200, 0);
		await app.institutions.shouldBeVisible();
	});

	test('It should open "Support" pages', async ({ app }) => {
		await app.header.support.open();
		await app.header.support.shouldHave(['Contact us', 'Sign up', 'Start chatting']);
	});

	test('It should open Beach Club landing page', async ({ app }) => {
		await app.header.beachClub();
		await app.beachClubLandingPage.shouldBeVisible();
	});
});
