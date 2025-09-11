import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletSonicFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletSonic';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, veryLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';
import { unstakeLvTokens } from 'testsEarnProtocol/z_sharedTestSteps/unstakeLvTokens';

const test = testWithSynpress(withRealWalletSonicFixtures);

test.describe('With real wallet - Sonic USDC.E Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await app.positionPage.open(
			'/earn/sonic/position/0x507a2d9e87dbd3076e65992049c41270b47964f8/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Sonic USDC.E position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC.E',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});
	});

	test('It should deposit USDC.E - (until rejecting "Deposit" tx) - Sonic USDC.E position', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await deposit({
			metamask,
			app,
			nominatedToken: 'USDC.E',
			depositedToken: 'USDC.E',
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

test.describe('With real wallet - Sonic USDC.E Position page - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await app.positionPage.open(
			'/earn/sonic/position/0x507a2d9e87dbd3076e65992049c41270b47964f8/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC.E',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.selectTab('Withdraw');
	});

	test('It should show USDC.E balance amount to be withdrawn in $ - Sonic USDC.E position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[3-4][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDC.E - (until rejecting "Withdraw" tx) - Sonic USDC.E position', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDC.E',
			withdrawnToken: 'USDC.E',
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

test.describe('With real wallet - Sonic USDC.e Position page - Unstake', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 100_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Sonic',
		});

		await app.positionPage.open(
			'/earn/sonic/position/0x507a2d9e87dbd3076e65992049c41270b47964f8/0x10649c79428d718621821cf6299e91920284743f'
		);

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.5000',
			token: 'USDC.E',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();
	});

	test('It should Unstake LV tokens - Sonic USDC.e position', async ({ app, metamask }) => {
		await unstakeLvTokens({
			metamask,
			app,
			lvToken: 'LVUSDCe',
			lvTokenAmount: '0.5[0-9]{3}',
			dollarAmount: '0.5[0-9]{3}',
		});
	});
});
