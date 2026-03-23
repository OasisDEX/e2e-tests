import { expect, test } from '#earnProtocolFixtures';
import { expectDefaultTimeout } from 'utils/config';

test.describe('Vault page - Mainnet ETH Lower Risk', async () => {
	test.beforeEach(async ({ app }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 60_000);

		await app.vaultPage.open('/earn/mainnet/position/0x67e536797570b3d8919df052484273815a0ab506');
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
			managementFee: '0.30',
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
			token: 'ETH',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}K',
			usdAmount: '[0-9]{1,2}.[0-9]{2}M',
		});

		await app.vaultPage.shouldHaveDepositCap({
			token: 'ETH',
			tokenAmount: '[0-9]{1,2}.[0-9]{2}K',
		});
	});

	test('It should show "How it works" page', async ({ app }) => {
		await app.vaultPage.howItAllWorks();

		await app.vaultPage.howItWorks.shouldHaveHeader('How it all works', {
			timeout: expectDefaultTimeout * 2,
		});
		await app.vaultPage.howItWorks.shouldLinkToLitePaper();
		await app.vaultPage.howItWorks.shouldHaveTabActive('Rebalance mechanism');
		await app.vaultPage.howItWorks.shouldHaveImage('how-it-works');

		await app.vaultPage.howItWorks.selectTab('Governance');
		await app.vaultPage.howItWorks.shouldHaveTabActive('Governance');
		await app.vaultPage.howItWorks.shouldHaveImage('governance');

		await app.vaultPage.howItWorks.shouldHaveHeader('Lower Risk Historical Yields', {
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.howItWorks.shouldHaveHeader('Security');
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
		if (await app.vaultPage.exposure.thereIsViewMoreButton()) {
			await app.vaultPage.exposure.viewMore();
		}

		await app.vaultPage.exposure.shouldNotHaveStrategyApysEqualToZero();
	});
});
