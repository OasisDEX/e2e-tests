import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout, veryLongTestTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletArbitrumFixtures);

test.describe('With real wallet - USDC Arbitrum Position page - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58/0x10649c79428d718621821cf6299e91920284743f'
		);
	});

	test('It should show Deposit balances and Deposit amounts - Arbitrum USDC vault', async ({
		app,
	}) => {
		// === USDC ===

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

		// === DAI ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('DAI');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '1.5[0-9]{3}',
			token: 'DAI',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '0.[4-6][0-9]',
		});

		// === WSTETH ===

		await app.positionPage.sidebar.openTokensSelector();
		await app.positionPage.sidebar.selectToken('WSTETH');

		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '0.0008',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.positionPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '[1-4],[0-9]{3}.[0-9]{2}',
		});
	});

	test('It should deposit WSTETH & DAI - (until rejecting "Deposit" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(veryLongTestTimeout);

		// === WSTETH ===

		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('WSTETH');

		// Wait for page to fully load
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.depositOrWithdraw('0.0005');

		await app.positionPage.sidebar.shouldHaveEstimatedEarnings(
			[
				{
					time: 'After 30 days',
					amount: '[1-2].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '6 months',
					amount: '[1-2].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '1 year',
					amount: '[1-2].[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '3 years',
					amount: '[2-3].[0-9]{4}',
					token: 'USDC',
				},
			],
			{ timeout: expectDefaultTimeout * 2 }
		);

		await app.positionPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.positionPage.sidebar.buttonShouldBeVisible('Preview', {
			timeout: expectDefaultTimeout * 2,
		});
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
			depositAmount: { amount: '0.0005', token: 'wstETH' },
			swap: {
				originalToken: 'WSTETH',
				originalTokenAmount: '0.0005',
				positionToken: 'USDC',
				positionTokenAmount: '[1-2].[0-9]{4}',
			},
			price: { amount: '[2-7],[0-9]{3}.[0-9]{2}', originalToken: 'wstETH', positionToken: 'USDC' },
			priceImpact: '[0-3].[0-9]{2}',
			slippage: '0.10',
			transactionFee: '[0-2].[0-9]{2}',
		});
		await app.positionPage.sidebar.previewStep.deposit();
		await metamask.rejectTransaction();

		// === DAI ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('DAI');

		// Wait for balance to fully load to avoid random fails
		await app.positionPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'DAI',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.positionPage.sidebar.depositOrWithdraw('0.5');

		await app.positionPage.sidebar.shouldHaveEstimatedEarnings(
			[
				{
					time: 'After 30 days',
					amount: '1.[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '6 months',
					amount: '1.[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '1 year',
					amount: '1.[0-9]{4}',
					token: 'USDC',
				},
				{
					time: '3 years',
					amount: '1.[0-9]{4}',
					token: 'USDC',
				},
			],
			{ timeout: expectDefaultTimeout * 2 }
		);
		await app.positionPage.sidebar.buttonShouldBeVisible('Preview');
		await app.positionPage.sidebar.preview();

		await app.positionPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.5000', token: 'DAI' },
			swap: {
				originalToken: 'DAI',
				originalTokenAmount: '0.5000',
				positionToken: 'USDC',
				positionTokenAmount: '0.[4-5][0-9]{3}',
			},
			price: { amount: '[0-1].[0-9]{4}', originalToken: 'DAI', positionToken: 'USDC' },
			priceImpact: '[0-3].[0-9]{2}',
			slippage: '0.10',
			transactionFee: '[0-2].[0-9]{2}',
		});
		await app.positionPage.sidebar.previewStep.deposit();
		await metamask.rejectTransaction();
	});
});

test.describe('With real wallet - USDC Arbitrum - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.positionPage.open(
			'/earn/arbitrum/position/0x4f63cfea7458221cb3a0eee2f31f7424ad34bb58/0x10649c79428d718621821cf6299e91920284743f'
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

	test('It should show maximum USDC balance amount to be withdrawn in $ - Arbitrum USDC position', async ({
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
		await app.positionPage.sidebar.depositOrWithdraw('0.5');
		// Wait for Estimated Earnings to avoid random fails
		await app.positionPage.sidebar.shouldHaveEstimatedEarnings([
			{
				time: 'After 30 days',
				amount: '0.00[0-9]{1,2}',
				token: 'USDC',
			},
			{
				time: '6 months',
				amount: '0.00[0-9]{1,2}',
				token: 'USDC',
			},
			{
				time: '1 year',
				amount: '0.00[0-9]{1,2}',
				token: 'USDC',
			},
			{
				time: '3 years',
				amount: '0.00[0-9]{1,2}',
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
			transactionFee: '[0-2].[0-9]{4}',
		});

		await app.positionPage.sidebar.previewStep.withdraw();
		await metamask.rejectTransaction();
	});

	// SKIP - Withdrawing to other tokens temporarily disabled.
	(['USDC', 'DAI', 'WSTETH'] as const).forEach((token) => {
		test.skip(`It should show USDC deposited balance amount to be withdrawn in ${
			token === 'USDC' ? '$' : token
		} when selecting ${token} in Arbitrum USDC vault`, async ({ app }) => {
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

	// SKIP - Withdrawing to other tokens temporarily disabled.
	test.skip('It should withdraw to USD₮0 and COMP - (until rejecting "Withdraw" tx)', async ({
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
			// slippage: '0.10',
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
			// slippage: '0.10',
			transactionFee: '[0-2].[0-9]{4}',
		});

		await app.positionPage.sidebar.previewStep.withdraw();
		await metamask.rejectTransaction();
	});
});
