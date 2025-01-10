import { testWithSynpress } from '@synthetixio/synpress';
import { test as withWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withTestWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withWalletArbitrumFixtures);

const { expect } = test;

test.describe('With real wallet - Arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }) => {
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});

		await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');
	});

	test('It should show USDC balance in Arbitrum USDC vault', async ({ app, metamask }) => {
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '1.00',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should change network', async ({ app, metamask }) => {
		// Wait for page to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();
		await app.vaultPage.sidebar.buttonShouldBeVisible('Deposit');
	});

	test('It should show WSTETH balance in Arbitrum USDC vault', async ({ app }) => {
		await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('WSTETH');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.0008',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show transaction details in "Preview" step', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		// Wait for page to fully load to avoid random fails
		await app.vaultPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// === USDC ===

		// Wait for page to fully load
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.4');
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

		// === WSTETH ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('WSTETH');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.0005');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			depositAmount: { amount: '0.0005', token: 'wstETH' },
			swap: {
				originalToken: 'WSTETH',
				originalTokenAmount: '0.0005',
				positionToken: 'USDC',
				positionTokenAmount: '[0-4].[0-9]{2,3}',
			},
			priceImpact: {
				amount: '[0-9],[0-9]{3}.[0-9]{2}',
				token: 'USDC',
				percentage: '0.[0-9]{2}',
			},
			slippage: '1.00',
			transactionFee: '[0-9].[0-9]{2}',
		});
	});

	test('It should deposit USDC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		// Wait for page to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		await app.vaultPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.5');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.confirm('Deposit');

		await metamask.rejectTransaction();
	});

	test('It should deposit WSTETH - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
			amount: '0.[0-9]{2,3}',
			token: 'USDC',
		});

		// Wait for page to fully load to avoid random fails
		await app.vaultPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('WSTETH');

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 3,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.0005');
			await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
				amount: '[1-3].[0-9]{2,3}',
				tokenOrCurrency: 'USDC',
			});
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.confirm('Deposit');

		await metamask.rejectTransaction();
	});
});

test.describe('With real wallet - Arbitrum - Withdraw', async () => {
	test.beforeEach(async ({ app, metamask }) => {
		await metamask.importWalletFromPrivateKey(process.env.OLD_WALLET_PK ?? 'wallet address needed');
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
			shortenedWalletAddress: '0xbEf4...E09F8',
		});

		await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');
		// Wait for page to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: 10_000,
		});
		await app.vaultPage.sidebar.changeNetwork();
		await metamask.approveSwitchNetwork();

		await app.vaultPage.sidebar.selectTab('Withdraw');
	});

	test('It should show USDC Withdraw balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[1-5].[0-9]{2,3}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	(['USDC', 'WBTC', 'WSTETH'] as const).forEach((token) => {
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
			}

			await app.vaultPage.sidebar.depositOrWithdraw('1');

			await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
				amount: '[0-9].[0-9]{2,3}',
				tokenOrCurrency: token === 'USDC' ? '$' : token,
			});
		});
	});

	// TODO
	test.skip('It should show withdraw transaction details in "Preview" step', async ({ app }) => {
		test.setTimeout(longTestTimeout);

		// === USDC ===

		// Wait for page to fully load
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.4');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});
			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			transactionFee: '[0-2].[0-9]{2}',
		});

		// === WBTC ===

		await app.earn.sidebar.goBack();
		await app.earn.sidebar.openTokensSelector();
		await app.earn.sidebar.selectToken('WBTC');

		// Wait for balance to fully load to avoid random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.4');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			swap: {
				originalToken: 'USDC',
				originalTokenAmount: '0.4',
				positionToken: 'WBTC',
				positionTokenAmount: '0.00[0-9]{2,3}',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', token: 'WBTC', percentage: '0.[0-9]{2}' },
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
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.4');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.previewStep.shouldHave({
			withdrawAmount: { amount: '0.4', token: 'USDC' },
			swap: {
				originalToken: 'USDC',
				originalTokenAmount: '0.4',
				positionToken: 'WSTETH',
				positionTokenAmount: '0.000[0-9]',
			},
			priceImpact: { amount: '[0-1].[0-9]{2,3}', token: 'wstETH', percentage: '0.[0-9]{2}' },
			slippage: '1.00',
			transactionFee: '[0-2].[0-9]{2}',
		});
	});

	// TODO
	test.skip('It should withdraw USDC - (until rejecting "approve" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await expect(async () => {
			await app.vaultPage.sidebar.depositOrWithdraw('0.5');
			// Wait for Estimated Earnings to avoid random fails
			await app.vaultPage.sidebar.shouldHaveEstimatedEarnings({
				amount: '0.[0-9]{2,3}',
				token: 'USDC',
			});

			await app.vaultPage.sidebar.buttonShouldBeVisible('Preview');
			await app.vaultPage.sidebar.preview();
		}).toPass();

		await app.vaultPage.sidebar.confirm('Withdraw');

		await metamask.rejectTransaction();
	});

	// TODO
	test.skip('It should withdraw USDBC - (until rejecting "approve" tx)', async ({
		app,
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDBC');

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await expect(async () => {
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
		}).toPass();

		await app.vaultPage.sidebar.confirm('Withdraw');

		await metamask.rejectTransaction();
	});
});
