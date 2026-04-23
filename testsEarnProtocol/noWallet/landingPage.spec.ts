import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Landing page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 40_000);

		await app.landingPage.openPage();
	});

	test('It should redirect to /earn page - "Launch App" in Hero banner', async ({ app }) => {
		await app.landingPage.launchApp();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test('It should show summary data', async ({ app }) => {
		await app.landingPage.shouldHaveSummary({
			tvl: '[0-9]{2,3}.[0-9]{2}M',
			numberOfVaults: '[1-2][0-9]',
			marketsOptimized: '[7-9][0-9]',
			maxApy: '[0-9]{1,2}.[0-9]{2}',
		});
	});

	// SKIP - Update test once page completed
	test.skip('It should filter products', async ({ app }) => {
		// ALL products are listed by default
		await app.landingPage.shouldHaveTabHighlighted('All Products');
		await app.landingPage.shouldHaveProducts([
			'Permissionless DeFi Vaults',
			'Permissioned RWA Vaults',
			'Build your own DeFi Vault',
			'Integrate high quality DeFi yield',
		]);

		// 'Permissionless DeFi Vaults' tab
		await app.landingPage.selectProductTab('Permissionless DeFi Vaults');

		await app.landingPage.shouldHaveTabHighlighted('Permissionless DeFi Vaults');
		await app.landingPage.shouldHaveProducts(['Permissionless DeFi Vaults']);
		await app.landingPage.shouldNotHaveProducts([
			'Permissioned RWA Vaults',
			'Build your own DeFi Vault',
			'Integrate high quality DeFi yield',
		]);

		// 'Permissioned RWA Vaults' tab
		await app.landingPage.selectProductTab('Permissioned RWA Vaults');

		await app.landingPage.shouldHaveTabHighlighted('Permissioned RWA Vaults');
		await app.landingPage.shouldHaveProducts(['Permissioned RWA Vaults']);
		await app.landingPage.shouldNotHaveProducts([
			'Permissionless DeFi Vaults',
			'Build your own DeFi Vault',
			'Integrate high quality DeFi yield',
		]);

		// 'Build your own DeFi Vault' tab
		await app.landingPage.selectProductTab('Build your own DeFi Vault');

		await app.landingPage.shouldHaveTabHighlighted('Build your own DeFi Vault');
		await app.landingPage.shouldHaveProducts(['Build your own DeFi Vault']);
		await app.landingPage.shouldNotHaveProducts([
			'Permissionless DeFi Vaults',
			'Permissioned RWA Vaults',
			'Integrate high quality DeFi yield',
		]);

		// 'Integrate high quality DeFi yield' tab
		await app.landingPage.selectProductTab('Integrate high quality DeFi yield');

		await app.landingPage.shouldHaveTabHighlighted('Integrate high quality DeFi yield');
		await app.landingPage.shouldHaveProducts(['Integrate high quality DeFi yield']);
		await app.landingPage.shouldNotHaveProducts([
			'Permissionless DeFi Vaults',
			'Permissioned RWA Vaults',
			'Build your own DeFi Vault',
		]);

		// 'All vaults' tab
		await app.landingPage.selectProductTab('All Products');

		await app.landingPage.shouldHaveTabHighlighted('All Products');
		await app.landingPage.shouldHaveProducts([
			'Permissionless DeFi Vaults',
			'Permissioned RWA Vaults',
			'Build your own DeFi Vault',
			'Integrate high quality DeFi yield',
		]);
	});

	test('It should redirect to "Permisionless DeFi Vaults" page', async ({ app }) => {
		await app.landingPage.learnMore('Permissionless DeFi Vaults');

		await app.landingPage.permissionlessVaults.shouldBeVisible();
	});

	// SKIP - Update test once page completed
	test.skip('It should redirect to "Permisoned RWA Vault" page', async ({ app }) => {
		await app.landingPage.learnMore('Permissioned RWA Vaults');

		await app.landingPage.permissionedRwaVault.shouldBeVisible();
	});

	// SKIP - Update text once page completed
	test.skip('It should redirect to "Build your own DeFi Vault" page', async ({ app }) => {
		await app.landingPage.learnMore('Build your own DeFi Vault');

		await app.landingPage.buildYourOwnVault.shouldBeVisible();
	});

	test('It should redirect to "Integrate high quality DeFi yield" page', async ({ app }) => {
		await app.landingPage.learnMore('Integrate high quality DeFi yield');

		await app.landingPage.integrateDefiYield.shouldBeVisible();
	});

	test('It should redirect to Leadershippage', async ({ app }) => {
		await app.landingPage.viewLeadership();

		await app.leadership.shouldBeVisible();
	});
});
