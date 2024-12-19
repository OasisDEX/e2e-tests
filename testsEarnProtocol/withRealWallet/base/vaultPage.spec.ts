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

	// TODO --> BUGS
	test.skip('It should show correct token in "Approve" step', async ({ app }) => {
		// USDC
		await app.vaultPage.sidebar.preview();
		await app.vaultPage.sidebar.approveStep.depositBlockShouldHave('USDC');
		await app.vaultPage.sidebar.approveStep.approveButtonShouldHave('USDC');

		// ===========

		// === TEMPORARY STEPS because of BUG ===
		await app.page.goto('/earn');

		await app.earn.vaults.nth(1).shouldBeVisible();
		await app.earn.vaults.nth(1).select();
		await app.earn.vaults.nth(1).shouldBeSelected();

		await app.earn.sidebar.openBalanceTokens();
		await app.earn.sidebar.selectBalanceToken('USDBC');

		// Wait for balance to be visible to avoind random fails
		await app.earn.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC', // 'USDBC', --> BUG: Wrong token displayed
			timeout: expectDefaultTimeout * 3,
		});

		await app.earn.sidebar.deposit('1');
		await app.earn.sidebar.getStarted();
		// ==================================

		// USDBC
		await app.vaultPage.sidebar.preview();
		await app.vaultPage.sidebar.approveStep.depositBlockShouldHave('USDBC');
		await app.vaultPage.sidebar.approveStep.approveButtonShouldHave('USDBC');
	});

	test('It should deposit USDC - (until rejecting "approve" tx)', async ({ app, metamask }) => {
		test.setTimeout(longTestTimeout);

		// Wait for balance to be visible to avoind random fails
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9]',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await app.vaultPage.sidebar.deposit('0.5');
		await app.vaultPage.sidebar.preview();
		// await app.vaultPage.sidebar.approve('USDC');
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
		await app.vaultPage.sidebar.deposit('1');
		await app.vaultPage.sidebar.shouldBeinUsdc('1');

		await app.vaultPage.sidebar.preview();
		await app.vaultPage.sidebar.approve('USDBC');
		await metamask.rejectTransaction();
	});
});
