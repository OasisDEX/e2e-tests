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
	});

	test('It should show Deposit balances and Deposit amounts - Arbitrum USDT vault', async ({
		app,
	}) => {
		await app.earn.vaults
			.byStrategy({ token: 'USD₮0', network: 'arbitrum' })
			.select({ delay: expectDefaultTimeout / 5 });

		await app.earn.vaults.byStrategy({ token: 'USD₮0', network: 'arbitrum' }).shouldBeSelected();

		await app.page.waitForTimeout(3_000);

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
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
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
			amount: '[0-1].[0-9]{2}',
		});
	});

	test('It should show Deposit balances and Deposit amounts - Base USDC vault', async ({ app }) => {
		await app.earn.vaults
			.byStrategy({ token: 'USDC', network: 'base' })
			.select({ delay: expectDefaultTimeout / 5 });

		await app.earn.vaults.byStrategy({ token: 'USDC', network: 'base' }).shouldBeSelected();

		// USDC
		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '[0-1].[0-9]{4}',
			token: 'USDC',
			timeout: expectDefaultTimeout * 3,
		});

		await app.vaultPage.sidebar.depositOrWithdraw('0.5');
		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: '$',
			amount: '0.[4-5][0-9]{3}',
		});

		// USDS
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('USDS');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '1.[0-9]{4}',
			token: 'USDS',
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '0.[4-6][0-9]',
		});

		// CBETH
		await app.vaultPage.sidebar.openTokensSelector();
		await app.vaultPage.sidebar.selectToken('CBETH');

		await app.vaultPage.sidebar.shouldHaveBalance({
			balance: '0.00[0-9]{2}',
			token: 'CBETH',
			timeout: expectDefaultTimeout * 2,
		});

		await app.vaultPage.sidebar.depositOrWithdrawAmountShouldBe({
			tokenOrCurrency: 'USDC',
			amount: '[0-9]{1,2}.[0-9]{2}(K)?',
		});
	});

	test('It should SUMR available to stake', async ({ app }) => {
		await app.earn.sumrBlockShouldHave({
			sumrRewardApy: '[0-9]{1,2}.[0-9]{2}',
			availableToStake: { sumrAmount: '[1-3].[0-9]{2,4}(K)?', usdAmount: '[0-9]{1,3}.[0-9]{2,4}' },
			usdcYield: { maxRate: '7.20', maxUsdPerYear: '[0-9]{1,3}' },
		});
	});

	test('It should redirect to "Portfolio > Rewards tab"', async ({ app }) => {
		await app.earn.openSumrRewardsTab();

		await app.portfolio.shoulBeVisible();
		await app.portfolio.shouldHaveTabHighlighted('SUMR Rewards');
		await app.portfolio.rewards.shouldBeVisible();
	});
});
