import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, veryLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Mainnet USDT Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d/0x10649c79428d718621821cf6299e91920284743f'
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDT',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show Deposit balances and Deposit amounts - Mainnet USDT position', async ({
		app,
	}) => {
		// === USDT ===

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});

		// === ETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('ETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0[0-9]{3}',
			token: 'ETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDT',
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
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
			tokenOrCurrency: 'USDT',
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
		});
	});

	test('It should deposit USDT & WETH - (until rejecting "Deposit" tx) - Mainnet USDT position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === USDT ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDT',
			depositedToken: 'USDT',
			depositAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '1.[0-9]{4}',
				sixMonthsAmount: '1.[0-9]{4}',
				oneYearAmount: '1.[0-9]{4}',
				threeYearsAmount: '1.[0-9]{4}',
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
			nominatedToken: 'USDT',
			depositedToken: 'WETH',
			depositAmount: '0.001',
			estimatedEarnings: {
				thirtyDaysAmount: '[1-7].[0-9]{4}',
				sixMonthsAmount: '[1-7].[0-9]{4}',
				oneYearAmount: '[1-7].[0-9]{4}',
				threeYearsAmount: '[1-7].[0-9]{4}',
			},
			previewInfo: {
				swap: {
					positionTokenAmount: '[0-7].[0-9]{4}',
				},
				price: { amount: '[0-9],[0-9]{3}.[0-9]{2}' },
				priceImpact: '[0-3].[0-9]{2}',
				slippage: '0.10',
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Mainnet USDT Position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDT',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum USDT balance amount to be withdrawn in $ - Mainnet USDT position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[3-4][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDT - (until rejecting "Withdraw" tx) - Mainnet USDT position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDT',
			withdrawnToken: 'USDT',
			withdrawAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '0.[0-9]{4}',
				sixMonthsAmount: '0.[0-9]{4}',
				oneYearAmount: '0.[0-9]{4}',
				threeYearsAmount: '0.[0-9]{4}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Mainnet USDT Position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 45_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x17ee2d03e88b55e762c66c76ec99c3a28a54ad8d/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDT',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Mainnet USDT position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'ethereum',
			token: 'USDT',
			risk: 'Lower Risk',
			balance: '0.[0-9]{4}',
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
				token: 'ETH',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'ethereum',
				token: 'ETH',
				risk: 'Higher Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Mainnet USDT position', async ({ app, metamask }) => {
		test.setTimeout(veryLongTestTimeout);

		// USDC Lower Risk
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USDT',
			targetToken: 'USDC',
			risk: 'Lower Risk',
		});

		// USDC Higher Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USDT',
			targetToken: 'USDC',
			risk: 'Higher Risk',
		});

		// ETH Higher Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USDT',
			targetToken: 'ETH',
			risk: 'Higher Risk',
		});

		// ETH Lower Risk
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'USDT',
			targetToken: 'ETH',
			risk: 'Lower Risk',
		});
	});
});
