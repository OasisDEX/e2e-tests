import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, veryLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - USDC Mainnet Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f'
		);

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show Deposit balances and Deposit amounts - Mainnet USDC vault', async ({
		app,
	}) => {
		// === USDC ===

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
			tokenOrCurrency: 'USDC',
			amount: '([1-4],)?[0-9]{3}.[0-9]{2}',
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
			tokenOrCurrency: 'USDC',
			amount: '([1-4],)?[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit USDC & WETH - (until rejecting "Deposit" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === USDC ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC',
			depositedToken: 'USDC',
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
			nominatedToken: 'USDC',
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

test.describe('With real wallet - USDC Mainnet - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/mainnet/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show maximum USDC balance amount to be withdrawn in $ - USDC Mainnet position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.5');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[4-5][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDC - (until rejecting "Withdraw" tx)', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC',
			withdrawnToken: 'USDC',
			withdrawAmount: '0.5',
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
	});
});
