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
		await app.vaultPage.sidebar.changeNetwork({ delay: 1000 });
		await metamask.approveSwitchNetwork();
		await app.vaultPage.sidebar.depositButtonShouldBeVisible();
	});

	// TODO - Add one or more tokens once it'sworking
	// test.skip('It should show ??? balance in Arbitrum USDC vault', async ({ app }) => {
	// 	await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');

	// 	await app.vaultPage.sidebar.openBalanceTokens();
	// 	await app.vaultPage.sidebar.selectBalanceToken('USDBC');

	// 	await app.vaultPage.sidebar.shouldHaveBalance({
	// 		balance: '1.05',
	// 		token: 'USDBC',
	// 		timeout: expectDefaultTimeout * 2,
	// 	});
	// });
});
