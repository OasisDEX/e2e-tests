import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Landing page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 40_000);

		await app.landingPage.openPage();
	});

	test.skip('It should show vault card', async ({ app }) => {
		await app.landingPage.shouldShowVaultCard();
	});

	test.skip('It should have tooltip with APY details and match card Net APY', async ({ app }) => {
		// Get Net APY in vault card
		const cardNetApy: string = await app.landingPage.getSelectedCardNetApy();

		await app.landingPage.openSelectedCardApyTooltip();
		await app.tooltips.netApy.shouldBeVisible();

		await app.tooltips.netApy.shouldHave({
			liveNativeApy: '[0-9]{1,2}.[0-9]{2}',
			sumrRewards: '[0-9]{1,2}.[0-9]{2}',
			managementFee: '1.00',
			netApy: '[0-9]{1,2}.[0-9]{2}',
		});

		// Get Net APY in vault card tooltip
		const tooltipDetails = await app.tooltips.netApy.getDetails();
		// Verify that card and tooltip Net APY match
		expect(
			cardNetApy,
			`Card Net APY(${cardNetApy}) should equal Card Tooltip Net APY (${tooltipDetails.netApy})`,
		).toEqual(tooltipDetails.netApy);

		// Verify that tooltip Net APY equals tooltip Native Live APY + SUMR rewards - Management Fee
		expect(
			parseFloat(tooltipDetails.liveNativeApy) +
				parseFloat(tooltipDetails.sumrRewards) -
				parseFloat(tooltipDetails.managementFee),
			`Native APY (${tooltipDetails.liveNativeApy}) + SUMR (${tooltipDetails.sumrRewards}) - Fee (${tooltipDetails.managementFee}) should be very close to Net APY (${tooltipDetails.netApy})`,
		).toBeCloseTo(parseFloat(tooltipDetails.netApy), 1);
	});

	(['right', 'left'] as const).forEach((direction) => {
		test.skip(`It should show vault card to the ${direction}`, async ({ app }) => {
			// To avoid flakiness
			await app.page.waitForTimeout(2_000);

			// Get vault info for current active vault in carousel
			const originalVaultCard = await app.landingPage.vaultsCarousel.activeSlide.getDetails({
				device: 'Desktop',
			});

			await app.landingPage.vaultsCarousel.arrowButtonShouldBevisible();

			await expect(async () => {
				// Move to vault to the right/left
				await app.landingPage.vaultsCarousel.moveToNextVault(direction, {
					timeout: expectDefaultTimeout * 2,
				});

				// Get vault info for current active vault in carousel
				const newVaultCard = await app.landingPage.vaultsCarousel.activeSlide.getDetails({
					device: 'Desktop',
				});

				expect(
					originalVaultCard.token == newVaultCard.token &&
						originalVaultCard.network == newVaultCard.network &&
						originalVaultCard.risk == newVaultCard.risk,
					'Vault details should not be equal',
				).not.toBeTruthy();
			}).toPass();
		});
	});

	test.skip('It should redirect to /earn page - "Higher yields > How you earn more" - Get started', async ({
		app,
	}) => {
		await app.landingPage.getStarted();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test.skip('It should redirect to /earn page - "Higher yields > How you earn more" - View Yields', async ({
		app,
	}) => {
		await app.landingPage.viewYields();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test.skip('It should redirect to /earn page - "Higher yields > How we use AI" - Get started', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How we use AI to outperform');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How we use AI to outperform');

		await app.landingPage.getStarted();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test.skip('It should redirect to /earn page - "Higher yields > How we use AI" - Learn more', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How we use AI to outperform');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How we use AI to outperform');

		// await app.landingPage.learnMore();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test.skip('It should redirect to /earn page - "Higher yields > How you save time" - Deposit', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How you save time and costs');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How you save time and costs');

		await app.landingPage.deposit();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test.skip('It should redirect to /earn page - "Higher yields > How you save time" - Learn more', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How you save time and costs');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How you save time and costs');

		// await app.landingPage.learnMore();
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	// ===============================================
	// ===============================================

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

	test('It should filter products', async ({ app }) => {
		// ALL products are listed by default
		await app.landingPage.shouldHaveTabHighlighted('All Vaults');
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
		await app.landingPage.selectProductTab('All Vaults');

		await app.landingPage.shouldHaveTabHighlighted('All Vaults');
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

	test('It should redirect to "Permisoned RWA Vault" page', async ({ app }) => {
		await app.landingPage.learnMore('Permissioned RWA Vaults');

		await app.landingPage.permissionedRwaVault.shouldBeVisible();
	});

	test('It should redirect to "Build your own DeFi Vault" page', async ({ app }) => {
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
