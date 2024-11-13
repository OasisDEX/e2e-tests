import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumRealWalletSetup from 'utils/synpress/real-wallet-setup/arbitrumRealWallet.setup';
import { setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import 'dotenv/config';

let app: App;

const test = testWithSynpress(metaMaskFixtures(arbitrumRealWalletSetup));
const { expect } = test;

// SKIP -- Not working with automation - 1inch might be blocking the walletwhen using automation tools
test.describe.skip('Aave v3 - Arbitrum - Wallet connected', async () => {
	test.beforeEach(async ({ page, metamask }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		await setup({
			metamask,
			app,
			network: 'arbitrum',
			withoutFork: true,
		});
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should open an Aave v3 Multiply Arbitrum position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/eth-usdc#setup');

		//
		await app.pause();
		//
		await app.position.setup.deposit({ token: 'ETH', amount: '0.001' });

		await app.position.setup.confirm();
		// Thre are two 'confirm' steps
		await app.position.setup.confirmOrRetry();

		await test.step('Reject Permission To Spend', async () => {
			await expect(async () => {
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		});
	});

	test('It should open an Aave v3 Earn correlated Arbitrum position - WSTETH/ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.page.goto('/arbitrum/aave/v3/multiply/WSTETH-ETH#setup');

		await app.position.setup.deposit({ token: 'WSTETH', amount: '0.0006' });

		await app.position.setup.confirm();
		// Thre are two 'confirm' steps
		await app.position.setup.confirm();

		await test.step('Reject Permission To Spend', async () => {
			await expect(async () => {
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		});
	});
});
