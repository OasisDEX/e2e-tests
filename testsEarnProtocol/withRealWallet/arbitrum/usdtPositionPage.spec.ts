import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, extremelyLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';
import { unstakeLvTokens } from 'testsEarnProtocol/z_sharedTestSteps/unstakeLvTokens';
import { expect } from '#earnProtocolFixtures';

const test = testWithSynpress(withRealWalletArbitrumFixtures);

test.describe('With real wallet - Arbitrum USD₮0 Position page - APY tag @arbitrum', async () => {
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
			'/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f',
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

test.describe('With real wallet - Arbitrum USD₮0 Position page - Deposit @arbitrum', async () => {
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
			'/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f',
		);
	});

	test('It should show Deposit balances and Deposit amounts - Arbitrum USD₮0 position', async ({
		app,
	}) => {
		// === USD₮0 ===

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'USD₮0',
			timeout: expectDefaultTimeout * 3,
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
			timeout: expectDefaultTimeout * 3,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USD₮0',
			amount: '0.[4-6][0-9]',
		});

		// === WSTETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('WSTETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0008',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 3,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USD₮0',
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
		});
	});

	test('It should deposit WSTETH & DAI - (until rejecting "Deposit" tx) - Arbitrum USD₮0 position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		// PRIVY
		// await app.positionPage.sidebar.changeNetwork();
		// await metamask.approveSwitchNetwork();

		// === WSTETH ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'USD₮0',
			depositedToken: 'WSTETH',
			depositAmount: '0.0005',
			estimatedEarnings: {
				thirtyDaysAmount: '[1-5].[0-9]{4}',
				sixMonthsAmount: '[1-5].[0-9]{4}',
				oneYearAmount: '[1-5].[0-9]{4}',
				threeYearsAmount: '[1-7].[0-9]{4}',
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
			nominatedToken: 'USD₮0',
			depositedToken: 'DAI',
			depositAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '[1-2].[0-9]{4}',
				sixMonthsAmount: '[1-2].[0-9]{4}',
				oneYearAmount: '[1-2].[0-9]{4}',
				threeYearsAmount: '[1-2].[0-9]{4}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Arbitrum USD₮0 Position page - Withdraw @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'USD₮0',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// PRIVY
		// await app.positionPage.sidebar.changeNetwork();
		// await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum USD₮0 balance amount to be withdrawn in $ - Arbitrum USD₮0 position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.5');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[4-5][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USD₮0 - (until rejecting "Withdraw" tx) - Arbitrum USD₮0 position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USD₮0',
			network: 'arbitrum',
			withdrawnToken: 'USD₮0',
			withdrawAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '0.5[0-9]{3}',
				sixMonthsAmount: '0.5[0-9]{3}',
				oneYearAmount: '0.5[0-9]{3}',
				threeYearsAmount: '0.[6-7][0-9]{3}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Arbitrum USD₮0 Position page - Switch @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'USD₮0',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// PRIVY
		// await app.positionPage.sidebar.changeNetwork();
		// await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Arbitrum USD₮0 position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'arbitrum',
			token: 'USD₮0',
			riskLevel: 'Lower Risk',
			balance: '1.[0-9]{4}',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			{
				network: 'arbitrum',
				token: 'USDC',
				riskLevel: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Arbitrum USD₮0 position', async ({ app, metamask }) => {
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USD₮0',
			network: 'arbitrum',
			targetToken: 'USDC',
		});
	});
});

test.describe('With real wallet - Arbitrum USD₮0 Position page - Unstake @arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F',
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'USD₮0',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// PRIVY
		// await app.positionPage.sidebar.changeNetwork();
		// await metamask.approveSwitchNetwork();
	});

	test('It should Unstake LV tokens - Arbitrum USD₮0 position', async ({ app, metamask }) => {
		await unstakeLvTokens({
			metamask,
			app,
			lvToken: 'LVUSDT',
			lvTokenAmount: '0.5[0-9]{3}',
			dollarAmount: '0.5[0-9]{3}',
		});
	});
});
