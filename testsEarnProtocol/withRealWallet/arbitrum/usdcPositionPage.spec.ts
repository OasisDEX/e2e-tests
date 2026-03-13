import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, extremelyLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';
import { expect } from '#earnProtocolFixtures';

const test = testWithSynpress(withRealWalletArbitrumFixtures);

test.describe('With real wallet - Arbitrum USDC Position page - APY tag @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x71d77c39db0eb5d086611a2e950198e3077cf58a/0x10649c79428d718621821cf6299e91920284743f',
		);
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
});

test.describe('With real wallet - Arbitrum USDC Position page - Deposit @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x71d77c39db0eb5d086611a2e950198e3077cf58a/0x10649c79428d718621821cf6299e91920284743f',
		);
	});

	test('It should show Deposit balances and Deposit amounts - Arbitrum USDC position', async ({
		app,
	}) => {
		// === USDC ===

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.2500',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});

		// === DAI ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('DAI');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '1.5[0-9]{3}',
			token: 'DAI',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '0.[4-6][0-9]',
		});

		// === WSTETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('WSTETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0008',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
		});
	});

	test('It should deposit WSTETH & DAI - (until rejecting "Deposit" tx) - Arbitrum USDC position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === WSTETH ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC',
			depositedToken: 'WSTETH',
			depositAmount: '0.0005',
			estimatedEarnings: {
				thirtyDaysAmount: '[1-5].[0-9]{4}',
				sixMonthsAmount: '[1-5].[0-9]{4}',
				oneYearAmount: '[1-5].[0-9]{4}',
				threeYearsAmount: '[1-8].[0-9]{4}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});

		// === DAI ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC',
			depositedToken: 'DAI',
			depositAmount: '0.75',
			estimatedEarnings: {
				thirtyDaysAmount: '1.[0-9]{4}',
				sixMonthsAmount: '1.[0-9]{4}',
				oneYearAmount: '1.[0-9]{4}',
				threeYearsAmount: '[1-2].[0-9]{4}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Arbitrum USDC Position page - Withdraw @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x71d77c39db0eb5d086611a2e950198e3077cf58a/0x10649c79428d718621821cf6299e91920284743f',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.2500',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum USDC balance amount to be withdrawn in $ - Arbitrum USDC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.25');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.2[4-5][0-9]{2}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDC - (until rejecting "Withdraw" tx) - Arbitrum USDC position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC',
			network: 'arbitrum',
			withdrawnToken: 'USDC',
			withdrawAmount: '0.2',
			estimatedEarnings: {
				thirtyDaysAmount: '0.0[5-6][0-9]{2}',
				sixMonthsAmount: '0.0[5-6][0-9]{2}',
				oneYearAmount: '0.0[5-6][0-9]{2}',
				threeYearsAmount: '0.0[5-8][0-9]{2}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Arbitrum USDC Position page - Switch @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x71d77c39db0eb5d086611a2e950198e3077cf58a/0x10649c79428d718621821cf6299e91920284743f',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.2500',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Arbitrum USDC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'arbitrum',
			token: 'USDC',
			riskLevel: 'Lower Risk',
			balance: '0.25[0-9]{2}',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			{
				network: 'arbitrum',
				token: 'USD₮0',
				riskLevel: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Arbitrum USDC position', async ({ app, metamask }) => {
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USDC',
			network: 'arbitrum',
			targetToken: 'USD₮0',
		});
	});
});
