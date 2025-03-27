import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Position page - Base - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Base USDC vault', async ({ app }) => {
		// USDC
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-1].[0-9]{4}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});

		// USDS
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('USDS');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '1.[0-9]{4}',
			token: 'USDS',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '0.[4-6][0-9]',
		});

		// CBETH
		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('CBETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'CBETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '[1-4],[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit USDC & USDS - (until rejecting "Deposit" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// === USDC ===

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC',
			depositedToken: 'USDC',
			depositAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '[0-1].[0-9]{4}',
				sixMonthsAmount: '[0-1].[0-9]{4}',
				oneYearAmount: '[0-1].[0-9]{4}',
				threeYearsAmount: '[1].[0-9]{4}',
			},
			previewInfo: { transactionFee: '[0-2].[0-9]{2}' },
		});

		// === USDS ===

		await app.earn.sidebar.goBack();

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC',
			depositedToken: 'USDS',
			depositAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '[0-1].[0-9]{4}',
				sixMonthsAmount: '[0-1].[0-9]{4}',
				oneYearAmount: '[0-1].[0-9]{4}',
				threeYearsAmount: '[1].[0-9]{4}',
			},
			previewInfo: {
				swap: {
					positionTokenAmount: '0.[3-4][0-9]{3}',
				},
				price: { amount: '[0-1].[0-9]{4}' },
				priceImpact: '[0-3].[0-9]{2}',
				slippage: '0.10',
				transactionFee: '[0-2].[0-9]{2}',
			},
		});
	});
});

test.describe('With real wallet - Base - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x98c49e13bf99d7cad8069faa2a370933ec9ecf17/0x10649c79428d718621821Cf6299e91920284743F'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]{4}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show USDC deposited balance amount to be withdrawn in $ when selecting USDC in Base USDC vault', async ({
		app,
	}) => {
		test.setTimeout(longTestTimeout);

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
		test.setTimeout(longTestTimeout);

		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC',
			withdrawnToken: 'USDC',
			withdrawAmount: '0.5',
			estimatedEarnings: {
				thirtyDaysAmount: '0.00[0-9]{1,2}',
				sixMonthsAmount: '0.00[0-9]{1,2}',
				oneYearAmount: '0.00[0-9]{1,2}',
				threeYearsAmount: '0.00[0-9]{1,2}',
			},
			previewInfo: {
				transactionFee: '[0-9]{1,2}.[0-9]{2}',
			},
		});
	});
});
