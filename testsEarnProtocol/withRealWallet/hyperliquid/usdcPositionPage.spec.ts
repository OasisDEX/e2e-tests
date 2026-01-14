import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletHyperliquidFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletHyperliquid';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, veryLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';

const test = testWithSynpress(withRealWalletHyperliquidFixtures);

test.describe('With real wallet - Hyperliquid USDC Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Hyperliquid',
		});

		await app.positionPage.open(
			'/earn/hyperliquid/position/0x015e60a0b239214fdeab9ad21318b12c0d97c15d/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Hyperliquid USDC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});
	});

	test('It should deposit USDC - (until rejecting "Deposit" tx) - Hyperliquid USDC position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

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
			// previewInfo: {
			// 	transactionFee: '[0-9]{1,2}.[0-9]{2}',
			// },
		});
	});
});

test.describe('With real wallet - Hyperliquid USDC Position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Hyperliquid',
		});

		await app.positionPage.open(
			'/earn/hyperliquid/position/0x015e60a0b239214fdeab9ad21318b12c0d97c15d/0x10649c79428d718621821cf6299e91920284743f'
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

	test('It should show USDC balance amount to be withdrawn in $ - Hyperliquid USDC position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[3-4][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDC - (until rejecting "Withdraw" tx) - Hyperliquid USDC position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC',
			withdrawnToken: 'USDC',
			withdrawAmount: '0.4',
			estimatedEarnings: {
				thirtyDaysAmount: '0.[1-2][0-9]{3}',
				sixMonthsAmount: '0.[1-2][0-9]{3}',
				oneYearAmount: '0.[1-2][0-9]{3}',
				threeYearsAmount: '0.[1-2][0-9]{3}',
			},
			// previewInfo: {
			// 	transactionFee: '[0-9]{1,2}.[0-9]{2}',
			// },
		});
	});
});
