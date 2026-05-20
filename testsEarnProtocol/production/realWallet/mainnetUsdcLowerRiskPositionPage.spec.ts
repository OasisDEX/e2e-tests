import { expect } from '#earnProtocolFixtures';
import { testWithSynpress } from '@synthetixio/synpress';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { expectDefaultTimeout } from 'utils/config';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Mainnet USDC Lower Risk position page', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f',
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9]{1,2}.[0-9]{2,4}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
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

	test('It should withdraw to USDC - (until rejecting "Withdraw" tx) - Mainnet USDC Lower Risk position page', async ({
		app,
		metamask,
	}) => {
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');

		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC',
			withdrawnToken: 'USDC',
			withdrawAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '0.0[0-9]{3}',
				sixMonthsAmount: '0.0[0-9]{3}',
				oneYearAmount: '0.0[0-9]{3}',
				threeYearsAmount: '0.0[0-9]{3}',
			},
		});
	});
});
