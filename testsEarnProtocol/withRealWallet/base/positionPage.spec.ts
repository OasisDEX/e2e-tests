import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Position page -  Base - Deposit', async () => {
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

		// === USDC ===

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.depositOrWithdraw('0.4');

		await app.positionPage.sidebar.shouldHaveEstimatedEarnings(
			[
				{
					time: 'After 30 days',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '6 months',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '1 year',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '3 years',
					amount: '[1].[0-9]{4}',
					token: 'USDC',
				},
			],
			{ timeout: expectDefaultTimeout * 2 }
		);
		await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
		await app.positionPage.sidebar.preview();

		await app.positionPage.sidebar.termsAndConditions.shouldBeVisible({
			timeout: expectDefaultTimeout * 2,
		});
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();

		await app.positionPage.sidebar.previewStep.shouldBeVisible({
			flow: 'deposit',
			timeout: expectDefaultTimeout * 2,
		});
		await app.positionPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.4', token: 'USDC' },
			transactionFee: '[0-2].[0-9]{2}',
		});
		await app.positionPage.sidebar.previewStep.deposit();
		await metamask.rejectTransaction();

		// === USDS ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('USDS');

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDS',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.shouldHaveEstimatedEarnings(
			[
				{
					time: 'After 30 days',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '6 months',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '1 year',
					amount: '[0-1].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '3 years',
					amount: '[1].[0-9]{4}',
					token: 'USDC',
				},
			],
			{ timeout: expectDefaultTimeout * 2 }
		);
		await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
		await app.positionPage.sidebar.preview();

		await app.positionPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.4000', token: 'USDS' },
			swap: {
				originalToken: 'USDS',
				originalTokenAmount: '0.4000',
				positionToken: 'USDC',
				positionTokenAmount: '0.[3-4][0-9]{3}',
			},
			price: { amount: '[0-1].[0-9]{4}', originalToken: 'USDS', positionToken: 'USDC' },
			priceImpact: '[0-3].[0-9]{2}',
			slippage: '1.00',
			transactionFee: '[0-2].[0-9]{2}',
		});
		await app.positionPage.sidebar.previewStep.deposit();
		await metamask.rejectTransaction();
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

	(['USDC', 'DAI', 'WSTETH'] as const).forEach((token) => {
		test(`It should show USDC deposited balance amount to be withdrawn in ${
			token === 'USDC' ? '$' : token
		} when selecting ${token} in Base USDC vault`, async ({ app }) => {
			test.setTimeout(longTestTimeout);

			if (token !== 'USDC') {
				await app.positionPage.sidebar.openTokensSelector();
				await app.positionPage.sidebar.selectToken(token);

				// Wait for balance to fully load to avoid random fails
				await app.positionPage.sidebar.shouldHaveBalance({
					balance: '0.5[0-9]{3}',
					token: 'USDC',
					timeout: expectDefaultTimeout * 2,
				});
				await app.page.waitForTimeout(expectDefaultTimeout / 3);
			}

			await app.positionPage.sidebar.depositOrWithdraw('0.5');

			await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
				amount: token === 'WSTETH' ? '0.00[0-9]{2}' : '0.[4-5][0-9]{3}',
				tokenOrCurrency: token === 'USDC' ? '$' : token,
			});
		});
	});

	test('It should withdraw to USDC and COMP - (until rejecting "Withdraw" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		// Wait for balance to be visible to avoind random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		// ==== USDC ====

		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		// Wait for Estimated Earnings to avoid random fails
		await app.positionPage.sidebar.shouldHaveEstimatedEarnings([
			{
				time: 'After 30 days',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '6 months',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '1 year',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '3 years',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
		]);

		await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
		await app.positionPage.sidebar.preview();

		await app.positionPage.sidebar.termsAndConditions.shouldBeVisible({
			timeout: expectDefaultTimeout * 2,
		});
		await app.positionPage.sidebar.termsAndConditions.agreeAndSign();
		await metamask.confirmSignature();

		await app.positionPage.sidebar.previewStep.shouldBeVisible({ flow: 'withdraw' });
		await app.positionPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.5', token: 'USDC' },
			// swap: {
			// 	originalToken: 'USDC',
			// 	originalTokenAmount: '0.4',
			// 	positionToken: 'USDC', // USDC token used for USDbC
			// 	positionTokenAmount: '0.4',
			// },
			// price: '???',
			// priceImpact: '???',
			// slippage: '1.00',
			transactionFee: '[0-2].[0-9]{4}',
		});

		await app.positionPage.sidebar.previewStep.withdraw();
		await metamask.rejectTransaction();

		// ==== COMP ====

		await app.positionPage.sidebar.goBack();

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('COMP');

		await app.positionPage.sidebar.shouldHaveEstimatedEarnings([
			{
				time: 'After 30 days',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '6 months',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '1 year',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
			{
				time: '3 years',
				amount: '0.00[0-9]{2}',
				token: 'USDC',
			},
		]);

		await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
		await app.positionPage.sidebar.preview();

		await app.positionPage.sidebar.previewStep.shouldBeVisible({ flow: 'withdraw' });
		await app.positionPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.5', token: 'USDC' },
			// TODO - BUG - Swap details not displayed for Withdraw flow
			// swap: {
			// 	originalToken: 'COMP',
			// 	originalTokenAmount: '0.4',
			// 	positionToken: 'USDC', // USDC token used for USDbC
			// 	positionTokenAmount: '0.4',
			// },
			// price: '???',
			// priceImpact: '???',
			// slippage: '1.00',
			transactionFee: '[0-2].[0-9]{4}',
		});

		await app.positionPage.sidebar.previewStep.withdraw();
		await metamask.rejectTransaction();
	});
});
