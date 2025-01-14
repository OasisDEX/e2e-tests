import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

const { expect } = test;

test.describe('With real wallet - Base - Deposit', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.page.goto('/earn/base/position/usdc-ya-later');
	});

	test('It should show USDC Deposit balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.5',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show USDBC Deposit balance in Base USDC vault', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDBC');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '1.05',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show transaction details in Deposit "Preview" step', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		// === USDC ===

		// Wait for page to fully load
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.4');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});
		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.4', token: 'USDC' },
			transactionFee: '[0-2].[0-9]{2}',
		});

		// === USDBC ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('USDBC');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.1');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.1', token: 'USDbC' },
			swap: {
				originalToken: 'USDC', // USDC token used for USDbC
				originalTokenAmount: '0.1',
				positionToken: 'USDC',
				positionTokenAmount: '0.[0-9]{2,3}',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', token: 'USDC', percentage: '[0-3].[0-9]{2}' },
			slippage: '1.00',
			transactionFee: '[0-2].[0-9]{2}',
		});
	});

	test('It should deposit USDC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.5');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.confirm('Deposit');

		await metamask.rejectTransaction();
	});

	test('It should deposit USDBC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDBC');

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 3,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[0-9]{2,3}',
			tokenOrCurrency: 'USDC',
		});
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.confirm('Deposit');

		await metamask.rejectTransaction();
	});
});

test.describe('With real wallet - Base - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 35_000);

		await metamask.importWalletFromPrivateKey(process.env.OLD_WALLET_PK ?? 'wallet address needed');
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			shortenedWalletAddress: '0xbEf4...E09F8',
		});

		await app.page.goto('/earn/base/position/usdc-ya-later');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.selectTab('Withdraw');
	});

	test('It should show USDC Withdraw balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[1-5].[0-9]{2,3}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	(['USDC', 'USDBC', 'WSTETH'] as const).forEach((token) => {
		test(`It should show amount to be withdrawn in ${
			token === 'USDC' ? '$' : token
		} when selecting ${token} in Base USDC vault`, async ({ app }) => {
			test.setTimeout(longTestTimeout);

			if (token !== 'USDC') {
				await app.vaultPage.sidebar.openTokensSelector();
				await app.vaultPage.sidebar.selectToken(token);

				// Wait for balance to fully load to avoid random fails
				await app.vaultPage.sidebar.shouldHaveBalance({
					balance: '[0-9].[0-9]',
					token: 'USDC',
					timeout: expectDefaultTimeout * 2,
				});
				await app.page.waitForTimeout(expectDefaultTimeout / 3);
			}

			await app.vaultPage.sidebar.depositOrWithdraw('1');

			await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
				amount: '[0-9].[0-9]{2,3}',
				tokenOrCurrency: token === 'USDC' ? '$' : token,
			});
		});
	});

	// FAILING - BUG - https://www.notion.so/oazo/144cbc0395cb478a8b81cff326740123?v=1528cbaf47f880fbb6ed000c666394bf&p=17b8cbaf47f8804e96e9c3b5cfb6bca3&pm=s
	test('It should show withdraw transaction details in "Preview" step', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		// === USDC ===

		// Wait for page to fully load
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.4');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});
		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			transactionFee: '[0-2].[0-9]{2}',
		});

		// === USDBC ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('USDBC');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.4');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			swap: {
				originalToken: 'USDC',
				originalTokenAmount: '0.4',
				positionToken: 'USDC', // USDC token used for USDbC
				positionTokenAmount: '0.4',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', token: 'USDbC', percentage: '[0-3].[0-9]{2}' },
			slippage: '1.00',
			transactionFee: '[0-2].[0-9]{2}',
		});

		// === WSTETH ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('WSTETH');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.4');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			swap: {
				originalToken: 'USDC',
				originalTokenAmount: '0.4',
				positionToken: 'WSTETH',
				positionTokenAmount: '0.000[0-9]',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', token: 'wstETH', percentage: '[0-3].[0-9]{2}' },
			slippage: '1.00',
			transactionFee: '[0-2].[0-9]{2}',
		});
	});

	test('It should withdraw USDC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.5');
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.confirm('Withdraw');

		await metamask.rejectTransaction();
	});

	test('It should withdraw USDBC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDBC');

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});
		await app.page.waitForTimeout(expectDefaultTimeout / 3);

		await app.vaultPage.sidebar.depositOrWithdraw('0.1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			amount: '0.[0-9]{2,3}',
			tokenOrCurrency: 'USDBC',
		});
		// Wait for Estimated Earnings to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
		await app.vaultPage.sidebar.preview();

		await app.vaultPage.sidebar.confirm('Withdraw');

		await metamask.rejectTransaction();
	});
});
