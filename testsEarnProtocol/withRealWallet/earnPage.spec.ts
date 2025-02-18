import { testWithSynpress } from '@synthetixio/synpress';
import { test as withRealWalletBaseFixtures } from '../../srcEarnProtocol/fixtures/withRealWalletBase';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout } from 'utils/config';

const test = testWithSynpress(withRealWalletBaseFixtures);

test.describe('With real wallet - Earn page', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});

		await app.earn.openPage();
	});

	test('It should show Deposit balances and Deposit amounts - Arbitrum USDT vault', async ({
		app,
	}) => {
		await app.earn.vaults
			.byStrategy({ token: 'USD₮0', network: 'arbitrum' })
			.select({ delay: expectDefaultTimeout / 5 });

		await app.earn.vaults.byStrategy({ token: 'USD₮0', network: 'arbitrum' }).shouldBeSelected();

		await app.page.waitForTimeout(2_000);

		// WSTETH
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('WSTETH');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.sidebar.depositOrWithdraw('1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USD₮0',
			amount: '[0-9],[0-9]{3}.[0-9]{2}',
		});

		// DAI
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('DAI');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-9].[0-9]{4}',
			token: 'DAI',
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USD₮0',
			amount: '[0-1].[0-9]{4}',
		});

		// USDT
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USD₮0');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'USD₮0',
			timeout: expectDefaultTimeout * 2,
		});

		// await app.vaultPage.sidebar.depositOrWithdraw('1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '[0-1].[0-9]{4}',
		});
	});

	// TO BE UPDTED
	test('It should show Deposit balances and Deposit amounts - Base USDC vault', async ({ app }) => {
		await app.earn.vaults.nth(1).select({ delay: expectDefaultTimeout / 5 });

		// USDC
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.50',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.sidebar.depositOrWithdraw('0.5');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.50',
		});

		// USDBC
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDBC');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '1.05',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});

		// await app.vaultPage.sidebar.depositOrWithdraw('1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '0.[4-6][0-9]',
		});

		// WSTETH
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('WSTETH');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.00',
			token: 'WSTETH',
			timeout: expectDefaultTimeout * 2,
		});

		// await app.vaultPage.sidebar.depositOrWithdraw('1');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '[1-4],[0-9]{3}.[0-9]{2}',
		});
	});
});
