import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import optimismRealWalletSetup from 'utils/synpress/real-wallet-setup/optimismRealWallet.setup';
import { setup } from 'utils/setup';
import { longTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import 'dotenv/config';

let app: App;

const test = testWithSynpress(metaMaskFixtures(optimismRealWalletSetup));
const { expect } = test;

test.describe('Aave v3 - Optimism - Wallet connected', async () => {
	test.beforeEach(async ({ page, metamask }) => {
		test.setTimeout(longTestTimeout);

		app = new App(page);

		await setup({
			metamask,
			app,
			network: 'optimism',
			withoutFork: true,
		});
	});

	test.afterEach(async () => {
		await app.page.close();
	});

	test('It should open an Aave v3 Multiply Optimism position - ETH/USDC @regression', async ({
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/eth-usdc#setup');

		// Delay to reduce flakiness
		await app.page.waitForTimeout(2_000);

		await app.position.setup.deposit({ token: 'ETH', amount: '0.001' });

		await app.position.setup.confirm();
		// Delay to reduce flakiness
		await app.page.waitForTimeout(1_000);
		// Thre are two 'confirm' steps
		await app.position.setup.confirmOrRetry();

		await test.step('Reject Permission To Spend', async () => {
			await expect(async () => {
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		});
	});

	test('It should open an Aave v3 Earn correlated Optimism position - WSTETH/ETH @regression', async ({
		metamask,
	}) => {
		test.setTimeout(longTestTimeout);

		await app.position.openPage('/optimism/aave/v3/multiply/WSTETH-ETH#setup');

		// Delay to reduce flakiness
		await app.page.waitForTimeout(2_000);

		await app.position.setup.deposit({ token: 'WSTETH', amount: '0.0007' });

		await app.position.setup.confirm();
		// Delay to reduce flakiness
		await app.page.waitForTimeout(1_000);
		// Thre are two 'confirm' steps
		await app.position.setup.confirmOrRetry();

		await test.step('Reject Permission To Spend', async () => {
			await expect(async () => {
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		});
	});
});
