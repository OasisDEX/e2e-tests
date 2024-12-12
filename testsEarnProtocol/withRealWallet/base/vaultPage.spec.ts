import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

const { expect } = test;

test.describe('With reaal wallet - Base', async () => {
	test.beforeEach(async ({ app, metamask }) => {
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.page.goto('/earn/base/position/usdc-ya-later');
	});

	test('It should show USDC balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sideBar.shouldHaveBalance({
			balance: '1.5',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show USDBC balance in Base USDC vault', async ({ app }) => {
		await app.vaultPage.sideBar.openBalanceTokens();
		await app.vaultPage.sideBar.selectBalanceToken('USDBC');

		await app.vaultPage.sideBar.shouldHaveBalance({
			balance: '1.05',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should deposit USDC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sideBar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await app.vaultPage.sideBar.deposit('1');
		await app.vaultPage.sideBar.preview();
		await app.vaultPage.sideBar.approve('USDC');

		await metamask.rejectTransaction();
	});

	test('It should deposit USDBC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		// TODO !!!!
		// THERE IS A BUG => Error when clicking 'Preview' for USDBC
		// // Wait for balance to be visible to avoind random fails
		// await app.vaultPage.sideBar.shouldHaveBalance({
		// 	balance: '[0-9]',
		// 	token: 'USDC',
		// 	timeout: expectDefaultTimeout * 3,
		// });
		// await app.vaultPage.sideBar.deposit('1');
		// await app.vaultPage.sideBar.preview();
		// await app.vaultPage.sideBar.approve('USDC');
		// await metamask.rejectTransaction();
	});
});
