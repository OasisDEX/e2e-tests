import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';
import arbitrumRealWalletSetup from 'utils/synpress/real-wallet-setup/arbitrumRealWallet.setup';
import { setup } from 'utils/setup';
import { longTestTimeout, veryLongTestTimeout } from 'utils/config';
import * as tx from 'utils/tx';
import { App } from 'src/app';
import 'dotenv/config';

let app: App;

const test = testWithSynpress(metaMaskFixtures(arbitrumRealWalletSetup));
const { expect } = test;

test.describe('Aave v3 - Arbitrum - Wallet connected', async () => {
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

	[
		{ positionType: 'Multiply', pool: 'ETH-USDC', depositAmount: '0.001' },
		{ positionType: 'Earn correlated', pool: 'WSTETH-ETH', depositAmount: '0.0006' },
	].forEach(({ positionType, pool, depositAmount }) =>
		test(`It should open an Aave V3 Arbitrum ${positionType} position - ${pool} @regression`, async ({
			metamask,
		}) => {
			test.setTimeout(veryLongTestTimeout);

			await app.position.openPage(`/arbitrum/aave/v3/multiply/${pool}#setup`);
			// Delay to reduce flakiness
			await app.page.waitForTimeout(2_000);

			await app.position.setup.deposit({ token: pool.split('-')[0], amount: depositAmount });

			await app.position.setup.shouldHaveTransactionCostOrFee();

			await app.position.setup.confirm();
			// Delay to reduce flakiness
			await app.page.waitForTimeout(1_000);

			await expect(async () => {
				// Thre are two 'confirm' steps
				await app.position.setup.confirmOrRetry();
				await tx.rejectPermissionToSpend({ metamask });
			}).toPass();
		})
	);
});
