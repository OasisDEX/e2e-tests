import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Landing page @regression', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 40_000);

		await app.landingPage.openPage();
	});

	test('It should show vault card', async ({ app }) => {
		await app.landingPage.shouldShowVaultCard();
	});

	test('It should have tooltip with APY details and match card Net APY', async ({ app }) => {
		// Get Net APY in vault card
		const cardNetApy: string = await app.landingPage.getSelectedCardNetApy();

		await app.landingPage.openSelectedCardApyTooltip();
		await app.landingPage.shouldHaveSelectedCardApyTooltipOpened();

		await app.landingPage.shouldHaveSelectedCardTooltipDetails({
			liveNativeApy: '[0-9]{1,2}.[0-9]{2}',
			sumrRewards: '[0-9]{1,2}.[0-9]{2}',
			managementFee: '1.00',
			netApy: '[0-9]{1,2}.[0-9]{2}',
		});

		// Get Net APY in vault card tooltip
		const tooltipDetails = await app.landingPage.getSelectedCardTooltipDetails();
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
		test(`It should show vault card to the ${direction}`, async ({ app }) => {
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
});
