import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Permissionless DeFi Vaults', async () => {
	test.beforeEach(async ({ app }) => {
		await app.landingPage.permissionlessVaults.openPage();
	});

	test('It should show vault card', async ({ app }) => {
		await app.landingPage.permissionlessVaults.shouldShowVaultCard();
	});

	test('It should have tooltip with APY details and match card Net APY', async ({ app }) => {
		// Get Net APY in vault card
		const cardNetApy: string = await app.landingPage.permissionlessVaults.getFirstCardNetApy();

		await app.landingPage.permissionlessVaults.openFirstCardApyTooltip();
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

	// SKIP - I"ve not found proper element property to be asserted when moving card in carousel
	(['right', 'left'] as const).forEach((direction) => {
		test.skip(`It should show vault card to the ${direction}`, async ({ app }) => {
			// To avoid flakiness
			await app.page.waitForTimeout(2_000);

			// Get vault info for current active vault in carousel
			const originalVaultCard =
				await app.landingPage.permissionlessVaults.vaultsCarousel.activeSlide.getDetails({
					device: 'Desktop',
				});

			await app.landingPage.permissionlessVaults.vaultsCarousel.arrowButtonShouldBevisible();

			await expect(async () => {
				// Move to vault to the right/left
				await app.landingPage.permissionlessVaults.vaultsCarousel.moveToNextVault(direction, {
					timeout: expectDefaultTimeout * 2,
				});

				// Get vault info for current active vault in carousel
				const newVaultCard =
					await app.landingPage.permissionlessVaults.vaultsCarousel.activeSlide.getDetails({
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

	test('It should redirect to /earn page - "Actively risk-managed"', async ({ app }) => {
		await app.landingPage.permissionlessVaults.view('Actively risk-managed');

		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'riskManagementTypes',
			riskManagementType: 'Risk-Managed by BlockAnalitica',
		});
	});

	test('It should redirect to /earn page - "DAO risk-managed"', async ({ app }) => {
		await app.landingPage.permissionlessVaults.view('DAO risk-managed');

		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
		await app.earn.vaults.allVaultsShouldBe({
			filter: 'riskManagementTypes',
			riskManagementType: 'DAO Risk-Managed',
		});
	});

	test('It should redirect to /earn page - "Start earning in minutes"', async ({ app }) => {
		await app.landingPage.permissionlessVaults.signUp();

		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 3 });
	});

	test('It should link to "Migrate" page and redirect to /earn page - "Migrate your existing DeFi positions"', async ({
		app,
	}) => {
		await app.landingPage.permissionlessVaults.shouldLinkToMigratePage();

		await app.landingPage.permissionlessVaults.migrate();
		// It should redirect to /earn page for 'logged out' status
		await app.earn.shouldBeVisible({ timeout: expectDefaultTimeout * 4 });
	});

	test('It should open to calendar in new tab - "Get a personalised onboarding experience"', async ({
		app,
	}) => {
		await app.landingPage.permissionlessVaults.shouldOpenCalendarInNewTab();
	});
});
