import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, extremelyLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';
import { unstakeLvTokens } from 'testsEarnProtocol/z_sharedTestSteps/unstakeLvTokens';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Mainnet ETH Higher Risk position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10/0x10649c79428d718621821cf6299e91920284743f'
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show Deposit balances and Deposit amounts - Mainnet ETH Higher Risk position', async ({
		app,
	}) => {
		// === ETH ===
		await app.positionPage.sidebar.depositOrWithdraw('0.5');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			// amount: '0.5000', --> Issue with 1Inch - Fix not prioritised
			amount: '0.[4-5][0-9]{3}',
		});

		// === USDC ===
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('USDC');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.500',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'WETH',
			amount: '0.000[0-9]',
		});

		// === WETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('WETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'WETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '([0-9],)?[0-9]{3}.[0-9]{2}',
		});
	});

	// SKIP - Enable once SUMR is deployed back to staging (currentlywith BUMMER)
	test.skip('It should deposit ETH, WETH & USDC (until rejecting "Deposit" tx) - Mainnet ETH Higher Risk position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === ETH ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'ETH',
			depositAmount: '0.001',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});

		// === WETH ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'WETH',
			depositAmount: '0.001',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});

		// === USDC ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'ETH',
			depositedToken: 'USDC',
			depositAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{2}',
				sixMonthsAmount: '0.00[0-9]{2}',
				oneYearAmount: '0.00[0-9]{2}',
				threeYearsAmount: '0.00[0-9]{2}',
			},
			previewInfo: {
				swap: {
					positionTokenAmount: '0.000[0-9]',
				},
				price: { amount: '0.000[0-9]' },
				// priceImpact: '[0-3].[0-9]{2}',
				slippage: '0.10',
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Mainnet ETH Higher Risk position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum ETH balance amount to be withdrawn in ETH - ETH Mainnet Higher Risk position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.0001');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			// amount: '0.0001',  --> Issue with 1Inch - Fix not prioritised
			amount: '<0.001',
			tokenOrCurrency: 'ETH',
		});
	});

	test('It should withdraw to ETH - (until rejecting "Withdraw" tx) - Mainnet ETH Higher Risk position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'ETH',
			withdrawnToken: 'ETH',
			withdrawAmount: '0.0001',
			estimatedEarnings: {
				thirtyDaysAmount: '0.000[0-9]',
				sixMonthsAmount: '0.000[0-9]',
				oneYearAmount: '0.000[0-9]',
				threeYearsAmount: '0.000[0-9]',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Mainnet ETH Higher Risk position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Mainnet ETH Higher Risk position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'ethereum',
			token: 'ETH',
			risk: 'Higher Risk',
			balance: '0.000[0-9]',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			{
				network: 'ethereum',
				token: 'USDC',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'ethereum',
				token: 'USDC',
				risk: 'Higher Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'ethereum',
				token: 'USDT',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'ethereum',
				token: 'ETH',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Mainnet ETH Higher Risk position @regression', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(extremelyLongTestTimeout);

		// USDC Lower risk
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			risk: 'Lower Risk',
		});

		// USDC Higher risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDC',
			risk: 'Higher Risk',
		});

		// USDT
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'USDT',
		});

		// ETH Lower Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'ETH',
			targetToken: 'ETH',
			risk: 'Lower Risk',
		});
	});
});

test.describe('With real wallet - Mainnet ETH Hogher Risk Position page - Unstake', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 110_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x2e6abcbcced9af05bc3b8a4908e0c98c29a88e10/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();
	});

	test('It should Unstake LV tokens - Mainnet ETH Lower Risk position', async ({
		app,
		metamask,
	}) => {
		await unstakeLvTokens({
			metamask,
			app,
			lvToken: 'LVWETH',
			lvTokenAmount: '0.000[2-3]',
			dollarAmount: '[0-1].[0-9]{2,4}',
		});
	});
});
