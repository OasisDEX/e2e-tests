import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';

import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, veryLongTestTimeout } from 'utils/config';
import { deposit } from 'testsEarnProtocol/z_sharedTestSteps/deposit';
import { withdraw } from 'testsEarnProtocol/z_sharedTestSteps/withdraw';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - USDT Mainnet Position page - Deposit', async () => {
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

	test('It should show Deposit balances and Deposit amounts - Mainnet USDT vault', async ({
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
			tokenOrCurrency: 'USDT',
			amount: '([1-4],)?[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit USDT & WETH - (until rejecting "Deposit" tx)', async ({
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

test.describe('With real wallet - USDT Mainnet - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 35_000);

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

	test('It should show maximum USDT balance amount to be withdrawn in $ - USDT Mainnet position', async ({
		app,
	}) => {
		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[3-4][0-9]{3}',
			tokenOrCurrency: '$',
		});
	});

	test('It should withdraw to USDT - (until rejecting "Withdraw" tx)', async ({
		app,
		metamask,
	}) => {
		await withdraw({
			metamask,
			app,
			nominatedToken: 'USDT',
			depositedToken: 'USDT',
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

	// // SKIP - Withdrawing to other tokens temporarily disabled.
	// (['DAI', 'WSTETH'] as const).forEach((token) => {
	// 	test.skip(`It should show ${token} deposited balance amount to be withdrawn in ${token} when selecting ${token} in USDC Mainnet vault`, async ({
	// 		app,
	// 	}) => {
	// 		test.setTimeout(longTestTimeout);

	// 		await app.positionPage.sidebar.openTokensSelector();
	// 		await app.positionPage.sidebar.selectToken(token);

	// 		// Wait for balance to fully load to avoid random fails
	// 		await app.positionPage.sidebar.shouldHaveBalance({
	// 			balance: '0.5[0-9]{3}',
	// 			token: 'USDC',
	// 			timeout: expectDefaultTimeout * 2,
	// 		});
	// 		await app.page.waitForTimeout(expectDefaultTimeout / 3);

	// 		await app.positionPage.sidebar.depositOrWithdraw('0.5');

	// 		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
	// 			amount: token === 'WSTETH' ? '0.00[0-9]{2}' : '0.[4-5][0-9]{3}',
	// 			tokenOrCurrency: token,
	// 		});
	// 	});
	// });

	// // SKIP - Withdrawing to other tokens temporarily disabled.
	// test.skip('It should withdraw to USD₮0 and COMP - (until rejecting "Withdraw" tx)', async ({
	// 	app,
	// 	metamask,
	// }) => {
	// 	test.setTimeout(longTestTimeout);

	// 	// Wait for balance to be visible to avoind random fails
	// 	await app.positionPage.sidebar.shouldHaveBalance({
	// 		balance: '[0-9]',
	// 		token: 'USDC',
	// 		timeout: expectDefaultTimeout * 3,
	// 	});
	// 	await app.page.waitForTimeout(expectDefaultTimeout / 3);

	// 	// ==== USDC ====

	// 	await app.positionPage.sidebar.depositOrWithdraw('0.5');
	// 	// Wait for Estimated Earnings to avoid random fails
	// 	await app.positionPage.sidebar.shouldHaveEstimatedEarnings([
	// 		{
	// 			time: 'After 30 days',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '6 months',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '1 year',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '3 years',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 	]);

	// 	await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
	// 	await app.positionPage.sidebar.preview();

	// 	await app.positionPage.sidebar.termsAndConditions.shouldBeVisible({
	// 		timeout: expectDefaultTimeout * 2,
	// 	});
	// 	await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
	// 	await metamask.confirmSignature();

	// 	await app.positionPage.sidebar.previewStep.shouldBeVisible({ flow: 'withdraw' });
	// 	await app.positionPage.sidebar.previewStep.shouldHave({
	// 		withdrawAmount: { amount: '0.5', token: 'USDC' },
	// 		// swap: {
	// 		// 	originalToken: 'USDC',
	// 		// 	originalTokenAmount: '0.4',
	// 		// 	positionToken: 'USDC', // USDC token used for USDbC
	// 		// 	positionTokenAmount: '0.4',
	// 		// },
	// 		// price: '???',
	// 		// priceImpact: '???',
	// 		// slippage: '0.10',
	// 		transactionFee: '[0-2].[0-9]{4}',
	// 	});

	// 	await app.positionPage.sidebar.previewStep.withdraw();
	// 	await metamask.rejectTransaction();

	// 	// ==== COMP ====

	// 	await app.positionPage.sidebar.goBack();

	// 	await app.positionPage.sidebar.openTokensSelector();
	// 	await app.positionPage.sidebar.selectToken('COMP');

	// 	await app.positionPage.sidebar.shouldHaveEstimatedEarnings([
	// 		{
	// 			time: 'After 30 days',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '6 months',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '1 year',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 		{
	// 			time: '3 years',
	// 			amount: '0.00[0-9]{2}',
	// 			token: 'USDC',
	// 		},
	// 	]);

	// 	await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
	// 	await app.positionPage.sidebar.preview();

	// 	await app.positionPage.sidebar.previewStep.shouldBeVisible({ flow: 'withdraw' });
	// 	await app.positionPage.sidebar.previewStep.shouldHave({
	// 		withdrawAmount: { amount: '0.5', token: 'USDC' },
	// 		// TODO - BUG - Swap details not displayed for Withdraw flow
	// 		// swap: {
	// 		// 	originalToken: 'COMP',
	// 		// 	originalTokenAmount: '0.4',
	// 		// 	positionToken: 'USDC', // USDC token used for USDbC
	// 		// 	positionTokenAmount: '0.4',
	// 		// },
	// 		// price: '???',
	// 		// priceImpact: '???',
	// 		// slippage: '0.10',
	// 		transactionFee: '[0-2].[0-9]{4}',
	// 	});

	// 	await app.positionPage.sidebar.previewStep.withdraw();
	// 	await metamask.rejectTransaction();
	// });
});
