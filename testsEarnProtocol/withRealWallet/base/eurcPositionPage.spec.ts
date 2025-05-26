import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { switchPosition } from 'testsEarnProtocol/z_sharedTestSteps/switch';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Base EURC position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x64db8f51f1bf7064bb5a361a7265f602d348e0f0/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Base EURC position', async ({
		app,
	}) => {
		// EURC
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-1].[0-9]{4}',
			token: 'EURC',
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
			tokenOrCurrency: 'EURC',
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
			tokenOrCurrency: 'EURC',
			amount: '([1-4],)?[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit EURC & USDS - (until rejecting "Deposit" tx) - Base EURC position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		// === EURC ===

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'EURC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await deposit({
			metamask,
			app,
			nominatedToken: 'EURC',
			depositedToken: 'EURC',
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
			nominatedToken: 'EURC',
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

test.describe('With real wallet - Base EURC position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 45_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x64db8f51f1bf7064bb5a361a7265f602d348e0f0/0x10649c79428d718621821Cf6299e91920284743F'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]{4}',
			token: 'EURC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show EURC deposited balance amount to be withdrawn in $ when selecting EURC - Base EURC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.4[0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to EURC - (until rejecting "Withdraw" tx) - Base EURC position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await withdraw({
			metamask,
			app,
			nominatedToken: 'EURC',
			withdrawnToken: 'EURC',
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

test.describe('With real wallet - Base EURC position page - Switch', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.positionPage.open(
			'/earn/base/position/0x64db8f51f1bf7064bb5a361a7265f602d348e0f0/0x10649c79428d718621821Cf6299e91920284743F'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]{4}',
			token: 'EURC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.selectTab('Switch');
	});

	test('It should display info about original and target vaults - Switch Base EURC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.switch.yourPositionShouldBe({
			network: 'base',
			token: 'EURC',
			risk: 'Lower Risk',
			balance: '0.5[0-9]{3}',
			liveAPY: '[0-9]{1,2}.[0-9]{2}',
		});

		await app.positionPage.sidebar.switch.targetPositionsShouldBe([
			{
				network: 'base',
				token: 'USDC',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
			{
				network: 'base',
				token: 'ETH',
				risk: 'Lower Risk',
				thirtyDayAPY: '[0-9]{1,2}.[0-9]{2}',
				liveAPY: '[0-9]{1,2}.[0-9]{2}',
				apySpread: '[0-9]{1,2}.[0-9]{2}',
			},
		]);
	});

	test('It should switch Base EURC position', async ({ app, metamask }) => {
		// USDC
		await switchPosition({
			metamask,
			app,
			nominatedToken: 'EURC',
			targetToken: 'USDC',
		});

		// ETH
		await app.earn.sidebar.goBack();

		await switchPosition({
			metamask,
			app,
			nominatedToken: 'EURC',
			targetToken: 'ETH',
		});
	});
});
