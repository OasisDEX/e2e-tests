import { test } from '#earnProtocolFixtures';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

test.describe('Header - App @regression', async () => {
	test('It should redirect to Earn page', async ({ app }) => {
		await app.sumr.openPage();
		await app.sumr.shouldBeVisible();

		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.summerfi();
		await app.earn.shouldBeVisible();
	});

	// SKIP - TO BE UPDATED
	test.skip('It should open Earn page @balance', async ({ app }) => {
		await app.header.earn();
		await app.earn.shouldBeVisible();
	});

	test('It should open "Products" pages', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.products.open();
		await app.header.products.select('Permissionless DeFi Vaults');
		await app.page.mouse.move(200, 0);
		await app.landingPage.permissionlessVaults.shouldBeVisible();

		await app.earn.openPage();
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.products.open();
		await app.header.products.select('Build your own Vault');
		await app.page.mouse.move(200, 0);
		await app.landingPage.buildYourOwnVault.shouldBeVisible();

		await app.earn.openPage();
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.products.open();
		await app.header.products.select('Integrate the Lazy Summer Protocol');
		await app.page.mouse.move(200, 0);
		await app.landingPage.integrateDefiYield.shouldBeVisible();
	});

	test('It should open "$SUMR" pages', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.sumr.open();
		await app.header.sumr.select('$SUMR token');
		await app.page.mouse.move(200, 0);
		await app.sumr.shouldBeVisible();

		// To avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.sumr.open();
		await app.header.sumr.select('SUMR staking');
		await app.page.mouse.move(200, 0);
		await app.staking.shouldBeVisible();
	});

	test('It should show "$SUMR" menu options', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.sumr.open();
		await app.header.sumr.shouldHave(['Lazy Summer Forum', 'Lazy Summer Governance']);
	});

	test('It should open "Explore" pages', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.explore.open();
		await app.header.explore.select('User Activity');
		await app.page.mouse.move(200, 0);
		await app.userActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Rebalancing Activity');
		await app.page.mouse.move(200, 0);
		await app.rebalancingActivity.shouldBeVisible();

		await app.header.explore.open();
		await app.header.explore.select('Team');
		await app.page.mouse.move(200, 0);
		await app.team.shouldBeVisible();
	});

	test('It should open "Support" pages', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.support.open();
		await app.header.support.select('Institutional sales and support');
		await app.page.mouse.move(200, 0);
		await app.institutions.shouldBeVisible();
	});

	test('It should show "Support" menu options', async ({ app }) => {
		// Pause to avoid random fails
		await app.page.waitForTimeout(expectDefaultTimeout / 5);

		await app.header.support.open();
		await app.header.support.shouldHave(['Email support', 'Join the Discord Community']);
	});

	test('It should open Beach Club landing page', async ({ app }) => {
		await app.header.beachClub();
		await app.beachClubLandingPage.shouldBeVisible();
	});
});
