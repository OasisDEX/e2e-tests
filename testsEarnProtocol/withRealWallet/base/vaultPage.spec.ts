import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

const { expect } = test;

test.describe('With real wallet - Base', async () => {
	test.beforeEach(async ({ app, metamask }) => {
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.page.goto('/earn/base/position/usdc-ya-later');
	});

	test('It should show USDC balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.5',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show USDBC balance in Base USDC vault', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openBalanceTokens();
		await app.vaultPage.sidebar.selectBalanceToken('USDBC');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '1.05',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show transaction details in "Preview" step', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		// === USDC ===

		// Wait for page to fully load
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.deposit('0.4');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});
			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.4', token: 'USDC' },
			transactionFee: '[0-2].[0-9]{2}',
		});

		// === USDBC ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openBalanceTokens();
		await app.earn.sidebar.selectBalanceToken('USDBC');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.deposit('0.1');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.1', token: 'USDbC' },
			swap: {
				originalToken: 'USDC', // USDC token used for USDbC
				originalTokenAmount: '0.1',
				positionToken: 'USDC',
				positionTokenAmount: '0.1',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', positionToken: 'USDC', percentage: '0.[0-9]{2}' },
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

		await expect(async () => {
			await app.vaultPage.sidebar.deposit('0.5');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.confirmDeposit();

		await metamask.rejectTransaction();
	});

	test('It should deposit USDBC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openBalanceTokens();
		await app.vaultPage.sidebar.selectBalanceToken('USDBC');

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 3,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.deposit('0.1');
			await app.vaultPage.sidebar.shouldBeInUsdc('0.1');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.confirmDeposit();

		await metamask.rejectTransaction();
	});
});
