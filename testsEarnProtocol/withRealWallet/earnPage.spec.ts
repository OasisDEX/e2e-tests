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
			.byStrategy({ token: 'USD₮0', network: 'arbitrum', risk: 'Lower Risk' })
			.select({ delay: expectDefaultTimeout / 5 });

		await app.earn.vaults
			.byStrategy({ token: 'USD₮0', network: 'arbitrum', risk: 'Lower Risk' })
			.shouldBeSelected();

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
			.byStrategy({ token: 'USDC', network: 'base', risk: 'Lower Risk' })
			.select({ delay: expectDefaultTimeout / 5 });

		await app.earn.vaults
			.byStrategy({ token: 'USDC', network: 'base', risk: 'Lower Risk' })
			.shouldBeSelected();

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

	test('It should show SUMR available to stake', async ({ app }) => {
		await app.earn.sumrBlockShouldHave({
			sumrRewardApy: '[0-9].[0-9]{2}',
			availableToStake: {
				sumrAmount: '[0-9]{1,3}.[0-9]{2,4}(K)?',
				usdAmount: '[0-9]{1,3}.[0-9]{2,4}',
			},
			usdcYield: { maxRate: '[0-9]{1,2}.[0-9]{2}' },
			timeout: expectDefaultTimeout * 3,
		});
	});

	test('It should redirect to "Staking" page', async ({ app }) => {
		await app.earn.openSumrRewardsTab();

		await app.staking.shouldBeVisible();
	});
});

test.describe('With real wallet - Earn page', async () => {
	test.beforeEach(async ({ app, metamask }, testInfo) => {
		// Extending tests timeout by 25 extra seconds due to beforeEach actions
		testInfo.setTimeout(testInfo.timeout + 25_000);

		// Add wallet with only a few tokens
		const walletPK = process.env.OLD_WALLET_PK ?? '';
		await metamask.importWalletFromPrivateKey(walletPK);

		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
		});
	});

	test('It shoule toggle "In wallet" feature', async ({ app, metamask }) => {
		// 'In wallet' toggle OFF

		// Vaults for which user does not have tokens --> Displayed
		await app.earn.shouldHaveVaults([
			{ network: 'base', token: 'ETH', risk: 'Lower Risk' },
			{ network: 'base', token: 'EURC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USD₮0', risk: 'Lower Risk' },
			{ network: 'sonic', token: 'USDC.E', risk: 'Lower Risk' },
		]);

		// =====

		// 'In wallet' toggle ON
		await app.earn.toggleInWalletVaults();

		// Vaults for which user does not have tokens --> Hidden
		await app.earn.shouldNotHaveVaults([
			{ network: 'base', token: 'ETH', risk: 'Lower Risk' },
			{ network: 'base', token: 'EURC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USD₮0', risk: 'Lower Risk' },
			{ network: 'sonic', token: 'USDC.E', risk: 'Lower Risk' },
		]);
		// Vaults for which user has tokens --> Displayed
		await app.earn.shouldHaveVaults([
			{ network: 'arbitrum', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'arbitrum', token: 'USD₮0', risk: 'Lower Risk' },
			{ network: 'base', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'ethereum', token: 'ETH', risk: 'Lower Risk' },
			{ network: 'ethereum', token: 'ETH', risk: 'Higher Risk' },
			{ network: 'ethereum', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'ethereum', token: 'USDC', risk: 'Higher Risk' },
			{ network: 'ethereum', token: 'USDT', risk: 'Lower Risk' },
		]);

		// =====

		// 'In wallet' toggle back to OFF
		await app.earn.toggleInWalletVaults();

		// Vaults for which user does not have tokens --> Displayed
		await app.earn.shouldHaveVaults([
			{ network: 'base', token: 'ETH', risk: 'Lower Risk' },
			{ network: 'base', token: 'EURC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USDC', risk: 'Lower Risk' },
			{ network: 'hyperliquid', token: 'USD₮0', risk: 'Lower Risk' },
			{ network: 'sonic', token: 'USDC.E', risk: 'Lower Risk' },
		]);
	});
});
