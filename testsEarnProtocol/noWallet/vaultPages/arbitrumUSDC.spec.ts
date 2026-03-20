import { expect, test } from '#earnProtocolFixtures';

test.describe('Vault page - Arbitrum USDC', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 30_000);

		await app.vaultPage.open('/earn/arbitrum/position/0x71d77c39db0eb5d086611a2e950198e3077cf58a');
	});

	test('It should have tooltip with APY details and match Net APY tag', async ({ app }) => {
		// Get Net APY in tag
		await app.vaultPage.shouldHaveNetApyTag();
		const tagNetApy: string = await app.vaultPage.getTagNetApy();

		await app.vaultPage.openNetApyTooltip();
		await app.tooltips.netApy.shouldBeVisible();

		await app.tooltips.netApy.shouldHave({
			liveNativeApy: '[0-9]{1,2}.[0-9]{2}',
			sumrRewards: '[0-9]{1,2}.[0-9]{2}',
			managementFee: '1.00',
			netApy: '[0-9]{1,2}.[0-9]{2}',
		});

		// Get Net APY in tag tooltip
		const tooltipDetails = await app.tooltips.netApy.getDetails();
		// Verify that tag and tooltip Net APY match
		expect(
			tagNetApy,
			`Card Net APY(${tagNetApy}) should equal Card Tooltip Net APY (${tooltipDetails.netApy})`,
		).toEqual(tooltipDetails.netApy);

		// Verify that tooltip Net APY equals tooltip Native Live APY + SUMR rewards - Management Fee
		expect(
			parseFloat(tooltipDetails.liveNativeApy) +
				parseFloat(tooltipDetails.sumrRewards) -
				parseFloat(tooltipDetails.managementFee),
			`Native APY (${tooltipDetails.liveNativeApy}) + SUMR (${tooltipDetails.sumrRewards}) - Fee (${tooltipDetails.managementFee}) should be very close to Net APY (${tooltipDetails.netApy})`,
		).toBeCloseTo(parseFloat(tooltipDetails.netApy), 1);
	});

	test('It should show 30d APY, Live APY, Assets in vault and Deposit Cap info @regression', async ({
		app,
	}) => {
		await app.vaultPage.shouldHave30dApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveLiveApy('[0-9]{1,2}.[0-9]{2}');

		await app.vaultPage.shouldHaveAssets({
			token: 'USDC',
			tokenAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
			usdAmount: '[0-9]{1,3}.[0-9]{2}[MK]',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'USDC',
			tokenAmount: '[0-9]{2,3}.[0-9]{2}M',
		});
	});

	test('It should show strategies exposure and be 100% in total', async ({ app }) => {
		const totalAllocation = await app.vaultPage.exposure.getStrategiesTotalAllocation();

		expect(totalAllocation).toBeGreaterThan(99);
		expect(totalAllocation).toBeLessThanOrEqual(100);
	});

	test('It should not have duplicated strategy names', async ({ app }) => {
		await app.vaultPage.exposure.shouldNotHaveDuplicatedStrategyNames();
	});

	test('It should not have 0.00% APY for any arks', async ({ app }) => {
		await app.vaultPage.exposure.viewMore();

		await app.vaultPage.exposure.shouldNotHaveStrategyApysEqualToZero();
	});
});
