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

	test('It should redirect to /earn page - "View all xx strategies"', async ({ app }) => {
		await app.landingPage.viewAllStrategies();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How you earn more" - Get started', async ({
		app,
	}) => {
		await app.landingPage.getStarted();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How you earn more" - View Yields', async ({
		app,
	}) => {
		await app.landingPage.viewYields();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How we use AI" - Get started', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How we use AI to outperform');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How we use AI to outperform');

		await app.landingPage.getStarted();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How we use AI" - Learn more', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How we use AI to outperform');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How we use AI to outperform');

		await app.landingPage.learnMore();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How you save time" - Deposit', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How you save time and costs');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How you save time and costs');

		await app.landingPage.deposit();
		await app.earn.shouldBeVisible();
	});

	test('It should redirect to /earn page - "Higher yields > How you save time" - Learn more', async ({
		app,
	}) => {
		await app.landingPage.selectHigherYieldsTab('How you save time and costs');
		await app.landingPage.shouldHaveHieherYieldsTabVisible('How you save time and costs');

		await app.landingPage.learnMore();
		await app.earn.shouldBeVisible();
	});
});
