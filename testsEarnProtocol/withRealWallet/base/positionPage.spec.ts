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
	});

	test('It should show USDC balance in Base USDC position', async ({ app }) => {
		await app.page.goto('/earn/base/position/usdc-ya-later');

		await app.positionPage.sideBar.shouldHaveBalance({
			balance: '1.5',
			token: 'USDC',
			timeout: expectDefaultTimeout * 2,
		});
	});

	test('It should show USDBC balance in Base USDC position', async ({ app }) => {
		await app.page.goto('/earn/base/position/usdc-ya-later');

		await app.positionPage.sideBar.openBalanceTokens();
		await app.positionPage.sideBar.selectBalanceToken('USDBC');

		await app.positionPage.sideBar.shouldHaveBalance({
			balance: '1.05',
			token: 'USDBC',
			timeout: expectDefaultTimeout * 2,
		});
	});
});
