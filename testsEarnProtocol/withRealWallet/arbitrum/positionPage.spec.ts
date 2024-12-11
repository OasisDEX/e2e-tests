import { testWithSynpress } from '@synthetixio/synpress';
import { test as withWalletArbitrumFixtures } from '../../../srcEarnProtocol/fixtures/withTestWalletArbitrum';
import { logInWithWalletAddress } from 'srcEarnProtocol/utils/logIn';
import { expectDefaultTimeout, longTestTimeout } from 'utils/config';

const test = testWithSynpress(withWalletArbitrumFixtures);

const { expect } = test;

test.describe('With reaal wallet - Arbitrum', async () => {
	test.beforeEach(async ({ app, metamask }) => {
		await logInWithWalletAddress({
			metamask,
			app,
			wallet: 'MetaMask',
			network: 'Arbitrum',
		});
	});

	test('It should show USDC balance in Arbitrum USDC position', async ({ app, metamask }) => {
		await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');

		/* 
			Changing network in position page to avoid weird issue with Arbitrum
			when switching network in main page (/) and the visiting position page
		*/
		await app.positionPage.sideBar.changeNetwork({ delay: 500 });
		await metamask.approveSwitchNetwork();
		await app.page.reload();

		await app.positionPage.sideBar.shouldHaveBalance({
			balance: '1.00',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	// TODO - Add one or more tokens once it'sworking
	// test.skip('It should show ??? balance in Arbitrum USDC position', async ({ app }) => {
	// 	await app.page.goto('/earn/arbitrum/position/earn-mcyieldface-usdc');

	// 	await app.positionPage.sideBar.openBalanceTokens();
	// 	await app.positionPage.sideBar.selectBalanceToken('USDBC');

	// 	await app.positionPage.sideBar.shouldHaveBalance({
	// 		balance: '1.05',
	// 		token: 'USDBC',
	// 		timeout: expectDefaultTimeout * 2,
	// 	});
	// });
});
